"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const pathname = usePathname();
  const hidden = useMemo(
    () => pathname.startsWith("/admin") || pathname.startsWith("/login"),
    [pathname]
  );

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm Faishal Uddin Himel's portfolio assistant. Ask me about his projects, research, skills, certificates, experience, or how to contact him.",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const send = useCallback(async () => {
    const userMessage = message.trim();
    if (!userMessage || loading) return;

    setLoading(true);
    setMessage("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errMsg =
          data.error || "Sorry, something went wrong. Please try again.";
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: errMsg };
          return copy;
        });
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "I couldn't process that request.",
          };
          return copy;
        });
        setLoading(false);
        return;
      }

      let done = false;
      while (!done) {
        const chunk = await reader.read();
        done = chunk.done;
        if (chunk.value) {
          const text = decoder.decode(chunk.value, { stream: true });
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = {
              role: "assistant",
              content: `${last.content}${text}`,
            };
            return copy;
          });
        }
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Network error. Please check your connection and try again.",
        };
        return copy;
      });
    }

    setLoading(false);
  }, [message, loading]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! 👋 I'm Faishal Uddin Himel's portfolio assistant. Ask me about his projects, research, skills, certificates, experience, or how to contact him.",
      },
    ]);
  }, []);

  if (hidden) return null;

  return (
    <>
      {/* Inline styles for keyframe animations */}
      <style jsx global>{`
        @keyframes chat-slide-up {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes chat-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes chat-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes typing-dot {
          0%,
          60%,
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-4px);
          }
        }
        .chat-widget-panel {
          animation: chat-slide-up 0.25s ease-out;
        }
        .chat-msg {
          animation: chat-fade-in 0.2s ease-out;
        }
        .typing-dot:nth-child(1) {
          animation: typing-dot 1.2s infinite 0s;
        }
        .typing-dot:nth-child(2) {
          animation: typing-dot 1.2s infinite 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation: typing-dot 1.2s infinite 0.4s;
        }

        /* Markdown-style links inside assistant messages */
        .assistant-msg a {
          color: #818cf8;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .assistant-msg a:hover {
          color: #a5b4fc;
        }
      `}</style>

      <div className="fixed bottom-5 right-5 z-50">
        {/* ---------- Floating Button ---------- */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="group flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
            aria-label="Open chat assistant"
          >
            {/* Brain / sparkle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12"
            >
              <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.58.68 3 1.76 4L12 18l6.24-6.5A5.49 5.49 0 0 0 20 7.5 5.5 5.5 0 0 0 14.5 2c-1.56 0-2.97.66-3.97 1.71A5.48 5.48 0 0 0 9.5 2" />
              <path d="M12 18v4" />
              <path d="m4.5 13.5 2-2" />
              <path d="m17.5 13.5-2-2" />
            </svg>
          </button>
        )}

        {/* ---------- Chat Panel ---------- */}
        {open && (
          <div
            className="chat-widget-panel flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(15,15,25,0.97) 0%, rgba(10,10,18,0.99) 100%)",
              borderColor: "rgba(99,102,241,0.25)",
              maxHeight: "min(520px, calc(100vh - 6rem))",
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)",
                borderBottom: "1px solid rgba(99,102,241,0.15)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Ask About Me
                  </p>
                  <p className="text-[10px] text-indigo-300/70">
                    AI-powered portfolio assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="rounded-md px-2 py-1 text-[11px] text-indigo-300/60 transition-colors hover:bg-white/5 hover:text-indigo-200"
                  title="Clear chat"
                >
                  Clear
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-1 text-[11px] text-indigo-300/60 transition-colors hover:bg-white/5 hover:text-indigo-200"
                  title="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(99,102,241,0.2) transparent",
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`chat-msg flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${m.role === "user"
                      ? "rounded-br-md text-white"
                      : "assistant-msg rounded-bl-md text-gray-200"
                      }`}
                    style={
                      m.role === "user"
                        ? {
                          background:
                            "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
                        }
                        : {
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }
                    }
                    dangerouslySetInnerHTML={
                      m.role === "assistant"
                        ? { __html: renderMarkdownLight(m.content) }
                        : undefined
                    }
                  >
                    {m.role === "user" ? m.content : undefined}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading &&
                messages.length > 0 &&
                messages[messages.length - 1].content === "" && (
                  <div className="flex justify-start">
                    <div
                      className="flex gap-1.5 rounded-2xl rounded-bl-md px-4 py-3"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <span className="typing-dot h-2 w-2 rounded-full bg-indigo-400" />
                      <span className="typing-dot h-2 w-2 rounded-full bg-indigo-400" />
                      <span className="typing-dot h-2 w-2 rounded-full bg-indigo-400" />
                    </div>
                  </div>
                )}
            </div>

            {/* ── Input ── */}
            <div
              className="px-3 py-3"
              style={{
                borderTop: "1px solid rgba(99,102,241,0.12)",
                background: "rgba(0,0,0,0.3)",
              }}
            >
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                <input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about projects, papers, skills..."
                  className="flex-1 border-none bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  disabled={loading}
                />
                <button
                  onClick={send}
                  disabled={loading || !message.trim()}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-30"
                  style={{
                    background:
                      loading || !message.trim()
                        ? "rgba(99,102,241,0.2)"
                        : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  }}
                  aria-label="Send message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M22 2 11 13" />
                    <path d="M22 2 15 22 11 13 2 9z" />
                  </svg>
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-gray-600">
                Powered by RAG · Answers based on portfolio data only
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Lightweight markdown renderer for assistant messages.
 * Handles: **bold**, [links](url), `code`, and newlines.
 */
function renderMarkdownLight(text: string): string {
  if (!text) return "";
  let html = text
    // Escape basic HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Inline code
    .replace(/`(.+?)`/g, '<code style="background:rgba(99,102,241,0.15);padding:1px 4px;border-radius:3px;font-size:12px">$1</code>')
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Line breaks
    .replace(/\n/g, "<br />");

  return html;
}
