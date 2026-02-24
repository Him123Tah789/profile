import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { retrieveRelevantChunks, type RetrievedChunk } from "@/lib/ai/retriever";
import { buildChatSystemPrompt, buildChatMessages } from "@/lib/ai/prompts";

const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

export const runtime = "nodejs";

function isPrivateDocumentQuestion(input: string) {
  return /(private|confidential|hidden|internal).*(document|doc|file)|\bprivate\b.*\b(cv|paper|pdf)\b/i.test(input);
}

export async function POST(req: NextRequest) {
  try {
    // ---------- Parse ----------
    const body = await req.json();
    const userMessage = String(body?.message ?? "").trim();

    if (!userMessage || userMessage.length > 1500) {
      return NextResponse.json(
        { error: "Message is required and must be under 1500 characters." },
        { status: 400 }
      );
    }

    // ---------- Rate-limit (10 req / min per IP) ----------
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    if (isRateLimited(`chat:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    // ---------- Private doc guard ----------
    if (isPrivateDocumentQuestion(userMessage)) {
      return plainStream("That information is not available publicly.");
    }

    // ---------- API key check ----------
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Fallback: return chunk summaries without LLM
      const chunks = await retrieveRelevantChunks(userMessage, 4);
      if (!chunks.length) return plainStream("I don't have that information.");
      const summary = chunks
        .slice(0, 2)
        .map((c) => c.content.slice(0, 250).trim())
        .join(" ");
      return plainStream(summary);
    }

    // ---------- Retrieve relevant chunks (public only) ----------
    const chunks = await retrieveRelevantChunks(userMessage, 6);

    if (!chunks.length) {
      return plainStream(
        "I don't have that information in my portfolio data. Feel free to reach out directly via the contact page!"
      );
    }

    // ---------- Build prompt ----------
    const systemPrompt = buildChatSystemPrompt(chunks);
    const messages = buildChatMessages(systemPrompt, userMessage);

    // ---------- Call OpenAI (streaming) ----------
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: CHAT_MODEL,
          messages,
          stream: true,
          temperature: 0.3,
          max_tokens: 800,
        }),
      }
    );

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      // Graceful fallback
      const fallback = chunks
        .slice(0, 2)
        .map((c) => c.content.slice(0, 250).trim())
        .join(" ");
      return plainStream(fallback || "I couldn't process that right now.");
    }

    // ---------- Stream SSE → ReadableStream of plain text ----------
    const reader = openaiRes.body!.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async pull(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }

          const rawText = decoder.decode(value, { stream: true });
          const lines = rawText.split("\n").filter((l) => l.startsWith("data:"));

          for (const line of lines) {
            const payload = line.slice(5).trim();
            if (payload === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const parsed = JSON.parse(payload);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                controller.enqueue(new TextEncoder().encode(delta));
              }
            } catch {
              // skip malformed SSE chunks
            }
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

/** Helper: return a complete text answer as a pseudo-stream (for non-LLM paths) */
function plainStream(text: string) {
  const encoder = new TextEncoder();
  const words = text.split(/(\s+)/);

  const stream = new ReadableStream({
    async start(controller) {
      for (const piece of words) {
        controller.enqueue(encoder.encode(piece));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
