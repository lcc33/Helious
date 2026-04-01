"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/analyze?q=${encodeURIComponent(query)}`);
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Amber light orb — top right exactly like reference */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-10%",
          right: "-5%",
          width: "65%",
          height: "80%",
          background:
            "radial-gradient(ellipse at 70% 20%, rgba(255,200,80,0.55) 0%, rgba(200,140,40,0.25) 35%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Secondary warm fill */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "5%",
          right: "10%",
          width: "40%",
          height: "55%",
          background:
            "radial-gradient(ellipse at 60% 30%, rgba(255,230,140,0.35) 0%, transparent 60%)",
          filter: "blur(20px)",
        }}
      />

      {/* Giant background wordmark */}
      <div
        className="pointer-events-none absolute select-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(120px, 22vw, 280px)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.06)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(180,140,60,0.18) 50%, rgba(255,255,255,0.04) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          fontFamily: "'Georgia', serif",
          whiteSpace: "nowrap",
          zIndex: 0,
        }}
      >
        Helious
      </div>

      {/* Search input */}
      <div className="relative z-10 w-full max-w-lg px-4">
        <form onSubmit={handleSubmit}>
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste a contract address to analyze..."
              className="w-full bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 pr-14 text-white/80 text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors"
              style={{ fontFamily: "'Courier New', monospace" }}
            />
            <button
              type="submit"
              className="absolute right-3 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 group"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="text-white/60 group-hover:text-white transition-colors"
              >
                <path
                  d="M7 1L7 13M1 7L7 1L13 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 py-6 border-t border-white/5">
        <button className="text-white/30 hover:text-white/60 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1v14M1 8l7 7 7-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex items-center gap-6">
          <p className="text-white/40 text-xs leading-relaxed max-w-xs text-center hidden md:block">
            We are thrilled to unveil Helious, the most advanced smart contract
            guardian, blending AI reasoning with on-chain security knowledge.
          </p>
          <div className="flex gap-3">
            <Link
              href="/analyze"
              className="text-[11px] tracking-[0.1em] uppercase text-white/70 border border-white/15 rounded-full px-5 py-2 hover:bg-white/5 hover:border-white/30 transition-all"
            >
              Analyze Now
            </Link>
            <Link
              href="#products"
              className="text-[11px] tracking-[0.1em] uppercase text-white/40 border border-white/8 rounded-full px-5 py-2 hover:text-white/60 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}