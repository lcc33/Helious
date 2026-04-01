"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnalysisResult } from "@/types";
import Link from "next/link";
import ResultsPanel from "./ResultsPanel";
import ChatPanel from "./ChatPanel";

export default function ContractAnalyzer() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "functions" | "chat">("overview");
  const searchParams = useSearchParams();

  const loadingSteps = [
    "Fetching contract from Etherscan...",
    "Reading source code...",
    "Analyzing with Llama 3.3...",
    "Detecting risks...",
    "Generating safety score...",
  ];

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q.match(/^0x[a-fA-F0-9]{40}$/)) {
      setAddress(q);
      analyze(q);
    }
  }, []);

  useEffect(() => {
    if (!loading) { setLoadingStep(0); return; }
    const interval = setInterval(() => {
      setLoadingStep((s) => (s < loadingSteps.length - 1 ? s + 1 : s));
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  async function analyze(overrideAddress?: string) {
    const target = overrideAddress ?? address;
    if (!target.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError("Please enter a valid Ethereum address (starts with 0x, 42 characters).");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setActiveTab("overview");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const chatContext = result
    ? `Contract: ${result.contractName}. Summary: ${result.summary}. Risk level: ${result.risk_level}. Risks: ${result.risks.map((r) => r.description).join("; ")}`
    : "";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Ambient orb */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "55%",
            height: "70%",
            background:
              "radial-gradient(ellipse at 70% 20%, rgba(255,200,80,0.12) 0%, rgba(200,140,40,0.05) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-5 py-8">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/25 hover:text-white/55 transition-colors group"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M13 7H1M1 7L6 2M1 7L6 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] tracking-[0.12em] uppercase">Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <HeliosLogo />
            <span className="text-white/40 text-sm font-light" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
              Helious
            </span>
          </div>
        </div>

        {/* Hero text — shown only before result */}
        {!result && !loading && (
          <div className="mb-10 text-center">

            <h1
              className="text-white/80 text-4xl font-light mb-4 leading-tight"
              style={{ fontFamily: "'EB Garamond', Georgia, serif", letterSpacing: "-0.02em" }}
            >
              Is this contract<br />safe to interact with?
            </h1>
            <p className="text-white/30 text-sm leading-relaxed max-w-sm mx-auto">
              Paste any Ethereum contract address below. We'll analyze the source code and tell you exactly what it does — in plain English.
            </p>
          </div>
        )}

        {/* Input */}
        <div className="mb-2">
          <div
            className={`flex items-center gap-3 border rounded-2xl px-4 py-3 transition-all duration-300 ${error
              ? "border-red-500/30 bg-red-500/3"
              : "border-white/8 bg-white/2 hover:border-white/15 focus-within:border-white/25"
              }`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/20 flex-shrink-0">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
              <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={address}
              onChange={(e) => { setAddress(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && analyze()}
              placeholder="0x... paste contract address"
              className="flex-1 bg-transparent text-white/65 text-sm font-mono placeholder:text-white/15 focus:outline-none"
            />
            <button
              onClick={() => analyze()}
              disabled={loading}
              className="flex-shrink-0 text-[11px] tracking-[0.1em] uppercase text-white/60 border border-white/12 rounded-xl px-4 py-2 hover:bg-white/5 hover:border-white/25 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "..." : "Analyze"}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 mt-2 px-1">
              <div className="w-1 h-1 rounded-full bg-red-400/60 flex-shrink-0" />
              <p className="text-red-400/60 text-xs">{error}</p>
            </div>
          )}
        </div>

        {/* Example address hint */}
        {!result && !loading && (
          <p className="text-white/15 text-[11px] text-center mt-3 mb-2">
            Try{" "}
            <button
              onClick={() => {
                const demo = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
                setAddress(demo);
                analyze(demo);
              }}
              className="text-amber-500/40 hover:text-amber-500/70 transition-colors underline underline-offset-2"
            >
              DAI stablecoin
            </button>
            {" "}as an example
          </p>
        )}

        {/* Loading state */}
        {loading && (
          <div className="mt-12 text-center">
            <div className="relative inline-flex items-center justify-center mb-6">
              <svg width="56" height="56" viewBox="0 0 56 56" className="animate-spin" style={{ animationDuration: "3s" }}>
                <circle cx="28" cy="28" r="24" stroke="white" strokeOpacity="0.05" strokeWidth="1" fill="none" />
                <path d="M28 4 A24 24 0 0 1 52 28" stroke="rgba(255,200,80,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
              <div className="absolute">
                <HeliosLogo size={20} />
              </div>
            </div>
            <p
              className="text-white/50 text-base font-light mb-2"
              style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
            >
              {loadingSteps[loadingStep]}
            </p>
            <p className="text-white/15 text-xs">This takes 10–20 seconds</p>

            {/* Step dots */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {loadingSteps.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === loadingStep ? "20px" : "4px",
                    height: "4px",
                    background: i <= loadingStep ? "rgba(255,200,80,0.5)" : "rgba(255,255,255,0.1)",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8">
            {/* Contract identity */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className="text-white/80 text-2xl font-light"
                  style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
                >
                  {result.contractName}
                </h2>
                <p className="text-white/20 text-xs font-mono mt-0.5 truncate max-w-xs">
                  {address}
                </p>
              </div>
              <VerdictBadge level={result.risk_level} score={result.safety_score} />
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-white/6 mb-6">
              {(["overview", "functions", "chat"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative text-[11px] tracking-[0.1em] uppercase px-5 py-3 transition-all -mb-px ${activeTab === tab
                    ? "text-white/70"
                    : "text-white/20 hover:text-white/40"
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/40" />
                  )}
                  {tab === "chat" && (
                    <span className="ml-1.5 text-[9px] text-amber-500/50 border border-amber-500/20 rounded-full px-1.5 py-0.5">
                      AI
                    </span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === "overview" && <ResultsPanel result={result} />}
            {activeTab === "functions" && <FunctionsPanel result={result} />}
            {activeTab === "chat" && <ChatPanel context={chatContext} />}

            {/* Re-analyze */}
            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
              <p className="text-white/15 text-xs">
                AI analysis — not a security audit
              </p>
              <button
                onClick={() => { setResult(null); setAddress(""); }}
                className="text-[11px] tracking-[0.1em] uppercase text-white/25 hover:text-white/50 transition-colors"
              >
                Analyze another →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VerdictBadge({ level, score }: { level: string; score: number }) {
  const config = {
    safe: {
      bg: "bg-green-500/8",
      border: "border-green-500/20",
      dot: "bg-green-400",
      text: "text-green-400/80",
      label: "Safe",
    },
    medium: {
      bg: "bg-amber-500/8",
      border: "border-amber-500/20",
      dot: "bg-amber-400",
      text: "text-amber-400/80",
      label: "Use Caution",
    },
    dangerous: {
      bg: "bg-red-500/8",
      border: "border-red-500/20",
      dot: "bg-red-400",
      text: "text-red-400/80",
      label: "Dangerous",
    },
  }[level] ?? {
    bg: "bg-white/5",
    border: "border-white/10",
    dot: "bg-white/40",
    text: "text-white/50",
    label: "Unknown",
  };

  return (
    <div className={`flex flex-col items-center gap-1.5 ${config.bg} border ${config.border} rounded-2xl px-5 py-3`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
      </div>
      <span className={`text-2xl font-light ${config.text}`} style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
        {score}<span className="text-sm opacity-50">/100</span>
      </span>
    </div>
  );
}

function FunctionsPanel({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-2">
      <p className="text-white/20 text-xs mb-4">
        {result.functions.length} functions detected in this contract
      </p>
      {result.functions.map((fn, i) => (
        <div
          key={i}
          className="group bg-white/2 border border-white/5 hover:border-white/12 rounded-xl p-4 transition-all"
        >
          <div className="flex items-start gap-3">
            <span className="text-white/15 text-[10px] font-mono mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
            <div>
              <span className="font-mono text-xs text-amber-500/60 block mb-1.5">{fn.name}()</span>
              <span className="text-sm text-white/40 leading-relaxed">{fn.description}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HeliosLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="4" fill="white" fillOpacity="0.5" />
      <circle cx="14" cy="14" r="8" stroke="white" strokeWidth="1" strokeOpacity="0.15" fill="none" />
      <line x1="14" y1="0" x2="14" y2="6" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="14" y1="22" x2="14" y2="28" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="0" y1="14" x2="6" y2="14" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="22" y1="14" x2="28" y2="14" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" />
    </svg>
  );
}