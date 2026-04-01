import { AnalysisResult } from "@/types";

const severityConfig = {
  high: {
    bg: "bg-red-500/6",
    border: "border-red-500/15",
    icon: "text-red-400/70",
    badge: "bg-red-500/10 text-red-400/70",
    symbol: "▲",
    label: "High risk",
  },
  medium: {
    bg: "bg-amber-500/6",
    border: "border-amber-500/15",
    icon: "text-amber-400/70",
    badge: "bg-amber-500/10 text-amber-400/70",
    symbol: "◆",
    label: "Medium risk",
  },
  low: {
    bg: "bg-white/2",
    border: "border-white/6",
    icon: "text-white/25",
    badge: "bg-white/5 text-white/30",
    symbol: "●",
    label: "Low risk",
  },
};

export default function ResultsPanel({ result }: { result: AnalysisResult }) {
  const highRisks = result.risks.filter((r) => r.severity === "high");
  const medRisks = result.risks.filter((r) => r.severity === "medium");
  const lowRisks = result.risks.filter((r) => r.severity === "low");
  const ordered = [...highRisks, ...medRisks, ...lowRisks];

  return (
    <div className="space-y-5">
      {/* TL;DR summary card — most important, biggest */}
      <div className="border border-white/8 rounded-2xl p-6 bg-white/2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-amber-500/40" />
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">What this contract does</p>
        </div>
        <p
          className="text-white/70 text-lg font-light leading-relaxed"
          style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
        >
          {result.summary}
        </p>
      </div>

      {/* Risk breakdown */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/25">Risk breakdown</p>
          <div className="flex items-center gap-3 text-[10px] text-white/20">
            {highRisks.length > 0 && <span className="text-red-400/50">{highRisks.length} high</span>}
            {medRisks.length > 0 && <span className="text-amber-400/50">{medRisks.length} medium</span>}
            {lowRisks.length > 0 && <span>{lowRisks.length} low</span>}
          </div>
        </div>

        {ordered.length === 0 ? (
          <div className="border border-green-500/15 bg-green-500/4 rounded-xl p-4 flex items-center gap-3">
            <span className="text-green-400/60 text-lg">✓</span>
            <p className="text-green-400/60 text-sm">No significant risks detected.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ordered.map((risk, i) => {
              const cfg = severityConfig[risk.severity];
              return (
                <div
                  key={i}
                  className={`flex items-start gap-4 border ${cfg.border} ${cfg.bg} rounded-xl p-4`}
                >
                  <div className={`flex-shrink-0 mt-0.5 ${cfg.icon}`}>
                    <span className="text-xs">{cfg.symbol}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 text-sm leading-relaxed">{risk.description}</p>
                  </div>
                  <span className={`flex-shrink-0 text-[10px] tracking-wide rounded-full px-2.5 py-1 ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Should I interact? — verdict for non-technical users */}
      <VerdictCard level={result.risk_level} score={result.safety_score} />
    </div>
  );
}

function VerdictCard({ level, score }: { level: string; score: number }) {
  const verdicts = {
    safe: {
      title: "Generally safe to interact with",
      body: "This contract appears well-structured with no major red flags. Standard caution still applies — always verify you're on the correct site and only approve the specific action you intend.",
      border: "border-green-500/15",
      bg: "bg-green-500/4",
      titleColor: "text-green-400/80",
    },
    medium: {
      title: "Proceed with caution",
      body: "This contract has some elevated privileges or patterns that could pose a risk. Read the risks above carefully. Only interact if you fully understand what you're approving.",
      border: "border-amber-500/20",
      bg: "bg-amber-500/5",
      titleColor: "text-amber-400/80",
    },
    dangerous: {
      title: "Do not interact with this contract",
      body: "This contract contains patterns commonly associated with scams, rug pulls, or unauthorized fund access. We strongly advise against approving any transaction with this contract.",
      border: "border-red-500/20",
      bg: "bg-red-500/5",
      titleColor: "text-red-400/80",
    },
  }[level] ?? {
    title: "Unable to determine safety",
    body: "We could not fully analyze this contract. Exercise caution.",
    border: "border-white/8",
    bg: "bg-white/2",
    titleColor: "text-white/50",
  };

  return (
    <div className={`border ${verdicts.border} ${verdicts.bg} rounded-2xl p-5`}>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/20">Our verdict</p>
      </div>
      <p className={`text-base font-medium mb-2 ${verdicts.titleColor}`}
        style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "1.1rem" }}>
        {verdicts.title}
      </p>
      <p className="text-white/35 text-sm leading-relaxed">{verdicts.body}</p>
    </div>
  );
}