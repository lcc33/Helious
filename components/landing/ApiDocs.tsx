"use client";

import { useState } from "react";

const ENDPOINTS = [
  {
    method: "POST",
    path: "/api/analyze",
    description: "Analyze a smart contract by address. Returns a plain English summary, safety score, risk breakdown, and key functions.",
    request: `{
  "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F"
}`,
    response: `{
  "contractName": "Dai",
  "summary": "This is the DAI stablecoin contract...",
  "safety_score": 92,
  "risk_level": "safe",
  "risks": [
    {
      "severity": "low",
      "description": "Owner can add/remove authorized addresses."
    }
  ],
  "functions": [
    {
      "name": "transfer",
      "description": "Moves DAI tokens between addresses."
    }
  ]
}`,
  },
  {
    method: "POST",
    path: "/api/chat",
    description: "Ask a follow-up question about a previously analyzed contract. Pass the analysis context string returned from /api/analyze.",
    request: `{
  "question": "Can this contract withdraw my funds?",
  "context": "Contract: Dai. Summary: This is the DAI stablecoin..."
}`,
    response: `{
  "reply": "This contract cannot directly withdraw funds from your wallet. It can only move tokens you explicitly approve via the approve() function."
}`,
  },
];

const MODELS = [
  { name: "llama-3.3-70b-versatile", provider: "Groq", speed: "~1.2s", notes: "Default. Best accuracy." },
  { name: "llama-3.1-8b-instant", provider: "Groq", speed: "~0.4s", notes: "Faster, slightly less accurate." },
  { name: "mixtral-8x7b-32768", provider: "Groq", speed: "~0.8s", notes: "Good for long contracts." },
];

export default function ApiDocs() {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
      {/* Header */}
      <div className="mb-16">
        <h1
          className="text-white text-5xl font-light mb-4"
          style={{ fontFamily: "'EB Garamond', Georgia, serif", letterSpacing: "-0.02em" }}
        >
          Helious API
        </h1>
        <p className="text-white/40 text-sm leading-relaxed max-w-lg">
          Integrate smart contract analysis directly into your dApp, wallet, or security tool.
          All endpoints are REST-based and return JSON.
        </p>

        <div className="flex items-center gap-3 mt-6">
          <div className="flex items-center gap-2 border border-white/8 rounded-full px-4 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
            <span className="text-white/35 text-xs">Base URL: helious.vercel.app</span>
          </div>
          <span className="text-white/20 text-xs border border-white/8 rounded-full px-4 py-1.5">
            v1.0 — Ethereum Mainnet
          </span>
        </div>
      </div>

      {/* Authentication */}
      <Section label="Authentication">
        <p className="text-white/40 text-sm leading-relaxed mb-4">
          Helious API is currently open — no API key required during the beta. Rate limiting is applied per IP.
          Future versions will support token-based auth for higher limits.
        </p>
        <CodeBlock
          code={`// No auth header needed during beta\nfetch('https://helious.vercel.app/api/analyze', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ address: '0x...' })\n})`}
          language="javascript"
          id="auth"
          copied={copied}
          onCopy={copy}
        />
      </Section>

      {/* Endpoints */}
      <Section label="Endpoints">
        <div className="space-y-8">
          {ENDPOINTS.map((ep) => (
            <EndpointBlock key={ep.path} ep={ep} copied={copied} onCopy={copy} />
          ))}
        </div>
      </Section>

      {/* Models */}
      <Section label="Models">
        <p className="text-white/40 text-sm leading-relaxed mb-5">
          Helious uses Groq-hosted open models under the hood. The default model is optimized for
          accuracy on Solidity code. You can request a specific model via the optional{" "}
          <code className="text-amber-500/60 text-xs">model</code> field.
        </p>
        <div className="border border-white/6 rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/6">
                {["Model", "Provider", "Avg Speed", "Notes"].map((h) => (
                  <th key={h} className="text-left text-white/25 tracking-widest uppercase px-4 py-3 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODELS.map((m, i) => (
                <tr
                  key={m.name}
                  className={i !== MODELS.length - 1 ? "border-b border-white/4" : ""}
                >
                  <td className="px-4 py-3 font-mono text-amber-500/60">{m.name}</td>
                  <td className="px-4 py-3 text-white/30">{m.provider}</td>
                  <td className="px-4 py-3 text-green-500/50">{m.speed}</td>
                  <td className="px-4 py-3 text-white/25">{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Error codes */}
      <Section label="Errors">
        <div className="space-y-3">
          {[
            { code: "400", label: "Bad Request", desc: "Invalid or missing Ethereum address." },
            { code: "404", label: "Not Found", desc: "Contract not found or source not verified on Etherscan." },
            { code: "429", label: "Rate Limited", desc: "Too many requests. Wait and retry." },
            { code: "500", label: "Server Error", desc: "AI model failed to parse contract. Try again." },
          ].map((e) => (
            <div key={e.code} className="flex items-start gap-4 border border-white/6 rounded-xl px-4 py-3">
              <span
                className={`text-xs font-mono font-medium mt-0.5 ${e.code === "400" || e.code === "404"
                  ? "text-amber-500/60"
                  : "text-red-500/60"
                  }`}
              >
                {e.code}
              </span>
              <div>
                <p className="text-white/50 text-xs font-medium mb-0.5">{e.label}</p>
                <p className="text-white/25 text-xs">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-14">
      <div className="flex items-center gap-4 mb-6">
        <h2
          className="text-white/80 text-xl font-light"
          style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
        >
          {label}
        </h2>
        <div className="flex-1 h-px bg-white/5" />
      </div>
      {children}
    </div>
  );
}

function EndpointBlock({
  ep,
  copied,
  onCopy,
}: {
  ep: (typeof ENDPOINTS)[0];
  copied: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const methodColor = ep.method === "POST" ? "text-amber-500/70" : "text-green-500/70";

  return (
    <div className="border border-white/6 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors text-left"
      >
        <span className={`text-xs font-mono font-medium ${methodColor}`}>{ep.method}</span>
        <span className="font-mono text-white/60 text-sm">{ep.path}</span>
        <span className="text-white/25 text-xs flex-1">{ep.description}</span>
        <span className="text-white/20 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-white/6 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/6">
          <div className="p-5">
            <p className="text-white/25 text-[10px] tracking-[0.15em] uppercase mb-3">Request body</p>
            <CodeBlock
              code={ep.request}
              language="json"
              id={`req-${ep.path}`}
              copied={copied}
              onCopy={onCopy}
            />
          </div>
          <div className="p-5">
            <p className="text-white/25 text-[10px] tracking-[0.15em] uppercase mb-3">Response</p>
            <CodeBlock
              code={ep.response}
              language="json"
              id={`res-${ep.path}`}
              copied={copied}
              onCopy={onCopy}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CodeBlock({
  code,
  language,
  id,
  copied,
  onCopy,
}: {
  code: string;
  language: string;
  id: string;
  copied: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  return (
    <div className="relative group">
      <pre
        className="bg-white/3 border border-white/6 rounded-lg p-4 text-xs font-mono text-white/40 overflow-x-auto leading-relaxed"
        style={{ tabSize: 2 }}
      >
        <code>{code}</code>
      </pre>
      <button
        onClick={() => onCopy(code, id)}
        className="absolute top-3 right-3 text-[10px] tracking-widest uppercase text-white/20 hover:text-white/50 border border-white/8 hover:border-white/20 rounded px-2 py-1 transition-all opacity-0 group-hover:opacity-100"
      >
        {copied === id ? "Copied" : "Copy"}
      </button>
    </div>
  );
}