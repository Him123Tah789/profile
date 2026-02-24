import { db } from "@/lib/db";

export type RetrievedChunk = {
  chunkId: string;
  content: string;
  score: number;
  title: string;
  link: string;
  type: string;
};

const EMBED_MODEL = process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";

async function callOpenAIEmbeddings(input: string[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for embeddings");
  }

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Embeddings request failed: ${text}`);
  }

  const data = (await res.json()) as { data: Array<{ embedding: number[] }> };
  return data.data.map((item) => item.embedding);
}

export async function embedTexts(input: string[]) {
  if (!input.length) return [];

  const batchSize = 32;
  const vectors: number[][] = [];

  for (let i = 0; i < input.length; i += batchSize) {
    const batch = input.slice(i, i + batchSize);
    const embedded = await callOpenAIEmbeddings(batch);
    vectors.push(...embedded);
  }

  return vectors;
}

export async function embedText(input: string) {
  const [vector] = await embedTexts([input]);
  return vector;
}

/**
 * Cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Retrieve chunks by embedding the question and computing in-memory cosine similarity.
 * Falls back to keyword text search if embeddings are unavailable.
 */
export async function retrieveRelevantChunks(
  question: string,
  topK = 6
): Promise<RetrievedChunk[]> {
  if (!question.trim()) return [];

  const apiKey = process.env.OPENAI_API_KEY;

  // ─── Path A: Embedding-based retrieval (preferred) ───
  if (apiKey) {
    try {
      const questionEmbedding = await embedText(question);

      // Fetch all chunks that have embeddings from public sources
      const rows = await db.knowledgeChunk.findMany({
        where: {
          embedding: { not: null },
          knowledgeSource: { isPublic: true },
        },
        include: {
          knowledgeSource: { select: { title: true, link: true, type: true } },
        },
      });

      if (rows.length > 0) {
        // Score each chunk
        const scored = rows
          .map((row) => {
            const stored: number[] = JSON.parse(row.embedding!);
            const score = cosineSimilarity(questionEmbedding, stored);
            return {
              chunkId: row.id,
              content: row.content,
              score,
              title: row.knowledgeSource.title,
              link: row.knowledgeSource.link,
              type: row.knowledgeSource.type,
            };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, topK);

        return scored;
      }
    } catch (err) {
      console.error("Embedding retrieval failed, falling back to text search:", err);
    }
  }

  // ─── Path B: Keyword text search fallback ───
  const words = question
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (!words.length) return [];

  const sources = await db.knowledgeSource.findMany({
    where: { isPublic: true },
    include: { chunks: true },
  });

  const results: RetrievedChunk[] = [];

  for (const source of sources) {
    for (const chunk of source.chunks) {
      const lower = chunk.content.toLowerCase();
      const matchCount = words.filter((w) => lower.includes(w)).length;
      if (matchCount > 0) {
        results.push({
          chunkId: chunk.id,
          content: chunk.content,
          score: matchCount / words.length,
          title: source.title,
          link: source.link,
          type: source.type,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, topK);
}
