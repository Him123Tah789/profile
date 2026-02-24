import { db } from "@/lib/db";
import { embedTexts } from "@/lib/ai/retriever";

type KnowledgeInput = {
  type: "PROFILE" | "PROJECT" | "PAPER" | "CERTIFICATE" | "POST" | "DOCUMENT";
  sourceId: string;
  title: string;
  content: string;
  link: string;
  isPublic: boolean;
};

function normalizeText(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

export function chunkText(text: string, maxChars = 900, overlap = 100) {
  const minChars = 600;
  const normalized = normalizeText(text);
  if (!normalized) return [];

  const chunks: string[] = [];
  let cursor = 0;

  while (cursor < normalized.length) {
    const remaining = normalized.length - cursor;

    if (remaining <= maxChars) {
      const tail = normalized.slice(cursor).trim();
      if (tail.length < minChars && chunks.length > 0) {
        chunks[chunks.length - 1] = `${chunks[chunks.length - 1]} ${tail}`.trim();
      } else if (tail.length >= 120) {
        chunks.push(tail);
      }
      break;
    }

    let end = cursor + maxChars;
    let split = normalized.lastIndexOf(" ", end);
    if (split < cursor + minChars) {
      split = end;
    }

    const chunk = normalized.slice(cursor, split).trim();
    if (chunk.length >= minChars) {
      chunks.push(chunk);
    }

    cursor = Math.max(cursor + 1, split - overlap);
  }

  return chunks;
}

function toProfileSource(
  profile: Awaited<ReturnType<typeof db.profile.findFirst>>
): KnowledgeInput[] {
  if (!profile) return [];
  const parts = [
    profile.name,
    profile.headline || "",
    profile.bio || "",
    profile.location || "",
    profile.email || "",
  ];
  return [
    {
      type: "PROFILE",
      sourceId: profile.id,
      title: profile.name,
      content: parts.filter(Boolean).join("\n"),
      link: "/about",
      isPublic: true,
    },
  ];
}

export async function buildKnowledgeInputs() {
  const [profile, projects, papers, certificates, posts, documents] =
    await Promise.all([
      db.profile.findFirst(),
      db.project.findMany({ where: { status: "PUBLISHED" } }),
      db.paper.findMany({ where: { status: "PUBLISHED" } }),
      db.certificate.findMany(),
      db.post.findMany({ where: { status: "PUBLISHED" } }),
      db.document.findMany({
        where: { visibility: "PUBLIC", status: "PUBLISHED" },
      }),
    ]);

  const inputs: KnowledgeInput[] = [];

  inputs.push(...toProfileSource(profile));

  for (const p of projects) {
    inputs.push({
      type: "PROJECT",
      sourceId: p.id,
      title: p.title,
      content: [
        p.title,
        p.description,
        p.techStack.join(", "),
        p.tags.join(", "),
        p.githubLink || "",
        p.liveLink || "",
      ]
        .filter(Boolean)
        .join("\n"),
      link: "/projects",
      isPublic: true,
    });
  }

  for (const p of papers) {
    inputs.push({
      type: "PAPER",
      sourceId: p.id,
      title: p.title,
      content: [
        p.title,
        p.abstract,
        p.authors.join(", "),
        p.venue || "",
        String(p.year),
        p.tags.join(", "),
        p.pdfLink || "",
        p.codeLink || "",
      ]
        .filter(Boolean)
        .join("\n"),
      link: "/research",
      isPublic: true,
    });
  }

  for (const c of certificates) {
    inputs.push({
      type: "CERTIFICATE",
      sourceId: c.id,
      title: c.title,
      content: [
        c.title,
        c.issuer,
        String(c.year),
        c.tags.join(", "),
        c.credentialUrl || "",
      ]
        .filter(Boolean)
        .join("\n"),
      link: "/certificates",
      isPublic: true,
    });
  }

  for (const p of posts) {
    inputs.push({
      type: "POST",
      sourceId: p.id,
      title: p.title,
      content: [p.title, p.excerpt || "", p.content, p.tags.join(", ")]
        .filter(Boolean)
        .join("\n"),
      link: `/activity/${p.slug}`,
      isPublic: true,
    });
  }

  for (const d of documents) {
    inputs.push({
      type: "DOCUMENT",
      sourceId: d.id,
      title: d.title,
      content: [d.title, d.category, d.description || "", d.tags.join(", ")]
        .filter(Boolean)
        .join("\n"),
      link: `/api/download/document/${d.id}`,
      isPublic: true,
    });
  }

  return inputs;
}

export async function reindexKnowledge() {
  const inputs = await buildKnowledgeInputs();

  // Clear existing knowledge
  await db.knowledgeChunk.deleteMany();
  await db.knowledgeSource.deleteMany();

  for (const source of inputs) {
    const created = await db.knowledgeSource.create({
      data: {
        type: source.type,
        sourceId: source.sourceId,
        title: source.title,
        content: source.content,
        link: source.link,
        isPublic: source.isPublic,
      },
    });

    const chunks = chunkText(source.content, 900, 100);
    if (!chunks.length) continue;

    // Try to embed; if it fails (no API key), store chunks without embeddings
    let vectors: number[][] = [];
    try {
      vectors = await embedTexts(chunks);
    } catch (err) {
      console.warn("Embedding failed, storing chunks without embeddings:", err);
    }

    for (let i = 0; i < chunks.length; i++) {
      const embeddingJson = vectors[i] ? JSON.stringify(vectors[i]) : null;

      await db.knowledgeChunk.create({
        data: {
          knowledgeSourceId: created.id,
          chunkIndex: i,
          content: chunks[i],
          embedding: embeddingJson,
        },
      });
    }
  }

  return { sources: inputs.length };
}
