import ProductCard from "./ProductCard";

const products = [
  {
    title: "Helious",
    description:
      "Your on-chain guardian. Analyze any smart contract before you sign — plain English, instant results.",
    cta: "Use Now",
    href: "/analyze",
    visual: <HeliosVisual />,
  },
  {
    title: "API",
    description:
      "Supercharge your dApp with Helious's contract analysis, risk detection, and AI capabilities.",
    cta: "View Docs",
    href: "/api-docs",
    visual: <ApiVisual />,
  },
  {
    title: "News",
    description:
      "Stay up to date with the latest from Helious — product launches, security insights, and more.",
    cta: "Read Now",
    href: "/news",
    visual: <NewsVisual />,
  },
];

export default function Products() {
  return (
    <section id="products" className="px-8 py-24 max-w-7xl mx-auto">

      <h2
        className="text-white text-4xl md:text-5xl font-light mb-16"
        style={{ fontFamily: "'EB Garamond', Georgia, serif", letterSpacing: "-0.02em" }}
      >
        AI for all of Web3
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.title} {...p} />
        ))}
      </div>
    </section>
  );
}

function HeliosVisual() {
  return (
    <div className="relative w-full h-full flex items-end justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(200,150,50,0.15) 0%, transparent 70%)",
        }}
      />
      <svg
        viewBox="0 0 200 180"
        className="w-full opacity-20"
        style={{ marginBottom: "-8px" }}
      >
        <text
          x="100"
          y="160"
          textAnchor="middle"
          fontSize="120"
          fontWeight="800"
          fill="none"
          stroke="white"
          strokeWidth="0.8"
          fontFamily="Georgia, serif"
          letterSpacing="-4"
        >
          H
        </text>
        <circle cx="100" cy="80" r="30" stroke="white" strokeWidth="0.5" fill="none" strokeOpacity="0.3" />
        <circle cx="100" cy="80" r="8" fill="white" fillOpacity="0.4" />
      </svg>
    </div>
  );
}

function ApiVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full border border-white/10 rounded-lg p-3 font-mono text-[10px] text-white/30 space-y-1.5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <span className="text-white/20 tracking-widest">HELIOUS API</span>
        </div>
        <div>
          <span className="text-amber-500/50">POST</span>{" "}
          <span>/api/analyze</span>
        </div>
        <div className="pl-2 text-white/20">address: "0x6B17..."</div>
        <div className="pl-2 text-white/20">chain: "ethereum"</div>
        <div className="mt-2 text-green-500/40">→ 200 OK</div>
        <div className="pl-2 text-white/20">score: 84</div>
        <div className="pl-2 text-white/20">risk: "safe"</div>
      </div>
    </div>
  );
}

function NewsVisual() {
  const posts = [
    { tag: "Launch", title: "Introducing Helious" },
    { tag: "Product", title: "How safety scoring works" },
    { tag: "Developer", title: "API now open for builders" },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full space-y-2">
        {posts.map((post, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border border-white/6 rounded-lg px-3 py-2"
            style={{ opacity: 1 - i * 0.25 }}
          >
            <span
              className={`text-[9px] tracking-widest uppercase border rounded px-1.5 py-0.5 flex-shrink-0 ${post.tag === "Launch"
                ? "text-amber-500/50 border-amber-500/20"
                : post.tag === "Product"
                  ? "text-blue-400/50 border-blue-400/20"
                  : "text-green-500/50 border-green-500/20"
                }`}
            >
              {post.tag}
            </span>
            <span className="text-white/25 text-[11px] truncate">{post.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}