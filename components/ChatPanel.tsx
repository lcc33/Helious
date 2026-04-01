"use client";

import { useState } from "react";
import { ChatMessage } from "@/types";

const QUICK_QUESTIONS = [
  "Is this safe to approve?",
  "Can it take money from my wallet?",
  "Who has admin control?",
  "What's the worst that could happen?",
  "Explain it like I'm not a developer",
];

export default function ChatPanel({ context }: { context: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(question?: string) {
    const q = question || input.trim();
    if (!q || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error || "No response." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Empty state */}
      {messages.length === 0 && (
        <div className="mb-6">
          <p className="text-white/25 text-sm mb-4 text-center">
            Have questions? Ask anything about this contract in plain English.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-[11px] border border-white/8 rounded-full px-4 py-2 text-white/30 hover:text-white/60 hover:border-white/20 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-sm rounded-xl px-4 py-3 leading-relaxed ${msg.role === "user"
                  ? "bg-white/5 border border-white/8 text-white/55 ml-8"
                  : "bg-white/2 border border-white/5 text-white/50 mr-8"
                }`}
            >
              {msg.role === "assistant" && (
                <p className="text-[10px] tracking-widest uppercase text-white/20 mb-1.5">Helious AI</p>
              )}
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="bg-white/2 border border-white/5 rounded-xl px-4 py-3 mr-8">
              <p className="text-[10px] tracking-widest uppercase text-white/15 mb-1.5">Helious AI</p>
              <div className="flex gap-1.5 items-center">
                {[0, 150, 300].map((delay) => (
                  <div
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask a question about this contract..."
          className="flex-1 bg-white/2 border border-white/8 hover:border-white/15 focus:border-white/22 rounded-xl px-4 py-3 text-white/55 text-sm placeholder:text-white/15 focus:outline-none transition-colors"
        />
        <button
          onClick={() => send()}
          disabled={loading}
          className="text-[11px] tracking-[0.1em] uppercase text-white/45 border border-white/10 rounded-xl px-5 py-3 hover:text-white/65 hover:border-white/20 disabled:opacity-30 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
}