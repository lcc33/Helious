"use client";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  title: string;
  description: string;
  cta: string;
  href: string;
  visual: React.ReactNode;
}

export default function ProductCard({ title, description, cta, href, visual }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col border rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        borderColor: hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
        background: hovered
          ? "rgba(255,255,255,0.03)"
          : "rgba(255,255,255,0.01)",
        minHeight: "360px",
      }}
    >
      {/* Visual area */}
      <div className="flex-1 min-h-[180px] relative">{visual}</div>

      {/* Divider */}
      <div
        className="h-px mx-4 transition-colors duration-300"
        style={{ background: hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)" }}
      />

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <h3
          className="text-white text-base font-medium"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {title}
        </h3>
        <p className="text-white/35 text-xs leading-relaxed">{description}</p>

        <div className="mt-2">
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-white/50 border border-white/10 rounded-full px-4 py-2 hover:text-white/80 hover:border-white/25 transition-all duration-200"
          >
            {cta}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}