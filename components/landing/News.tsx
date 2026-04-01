const POSTS = [
  {
    date: "Apr 01, 2025",
    tag: "Launch",
    title: "Introducing Helious — AI Smart Contract Guardian",
    excerpt:
      "Today we're unveiling Helious, the first AI-powered platform that translates Ethereum smart contracts into plain English with real-time risk detection and safety scoring.",
    readTime: "3 min read",
  },
  {
    date: "Apr 01, 2025",
    tag: "Product",
    title: "How Helious scores contract safety",
    excerpt:
      "A deep dive into the scoring methodology behind Helious — how we weigh owner privileges, withdrawal permissions, and suspicious functions to generate a 0–100 safety score.",
    readTime: "5 min read",
  },
  {
    date: "Apr 01, 2025",
    tag: "Developer",
    title: "Helious API is now open for builders",
    excerpt:
      "Integrate smart contract analysis into your dApp, wallet, or security tool with two simple REST endpoints. No API key required during beta.",
    readTime: "2 min read",
  },
];

const tagColors: Record<string, string> = {
  Launch: "text-amber-500/60 border-amber-500/20",
  Product: "text-blue-400/60 border-blue-400/20",
  Developer: "text-green-500/60 border-green-500/20",
};

export default function News() {
  return (
    <div className="max-w-3xl mx-auto px-8 pt-32 pb-24">
      {/* Header */}
      <div className="mb-16">

        <h1
          className="text-white text-5xl font-light"
          style={{ fontFamily: "'EB Garamond', Georgia, serif", letterSpacing: "-0.02em" }}
        >
          Latest from Helious
        </h1>
      </div>

      {/* Posts */}
      <div className="space-y-0">
        {POSTS.map((post, i) => (
          <article
            key={i}
            className="group border-t border-white/6 py-8 cursor-pointer hover:border-white/12 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-[10px] tracking-[0.15em] uppercase border rounded-full px-3 py-0.5 ${tagColors[post.tag] || "text-white/30 border-white/10"
                  }`}
              >
                {post.tag}
              </span>
              <span className="text-white/20 text-xs">{post.date}</span>
              <span className="text-white/15 text-xs">· {post.readTime}</span>
            </div>

            <h2
              className="text-white/75 text-xl font-light mb-3 group-hover:text-white transition-colors leading-snug"
              style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
            >
              {post.title}
            </h2>

            <p className="text-white/30 text-sm leading-relaxed">{post.excerpt}</p>

            <div className="mt-4 flex items-center gap-2 text-white/20 group-hover:text-white/40 transition-colors">
              <span className="text-xs tracking-widest uppercase">Read more</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          </article>
        ))}

        <div className="border-t border-white/6" />
      </div>
    </div>
  );
}