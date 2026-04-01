"use client";

import Link from "next/link";

const links = [
  { label: "Helious", href: "/" },
  { label: "API", href: "/api-docs" },
  { label: "News", href: "/news" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
      {/* Logo */}
      <div className="flex items-center gap-6">
        <HeliosLogo />
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] tracking-[0.12em] uppercase text-white/40 hover:text-white/80 transition-colors duration-200 font-light"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/analyze"
        className="text-[11px] tracking-[0.12em] uppercase text-white/80 border border-white/20 rounded-full px-5 py-2 hover:bg-white/5 hover:border-white/40 transition-all duration-200"
      >
        Try Helious
      </Link>
    </nav>
  );
}

function HeliosLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="4" fill="white" />
      <circle cx="14" cy="14" r="8" stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none" />
      <line x1="14" y1="0" x2="14" y2="6" stroke="white" strokeOpacity="0.6" strokeWidth="1.2" />
      <line x1="14" y1="22" x2="14" y2="28" stroke="white" strokeOpacity="0.6" strokeWidth="1.2" />
      <line x1="0" y1="14" x2="6" y2="14" stroke="white" strokeOpacity="0.6" strokeWidth="1.2" />
      <line x1="22" y1="14" x2="28" y2="14" stroke="white" strokeOpacity="0.6" strokeWidth="1.2" />
      <line x1="3" y1="3" x2="7.2" y2="7.2" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="20.8" y1="20.8" x2="25" y2="25" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="25" y1="3" x2="20.8" y2="7.2" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="7.2" y1="20.8" x2="3" y2="25" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
    </svg>
  );
}