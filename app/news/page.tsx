import Navbar from "@/components/landing/Navbar";
import News from "@/components/landing/News";

export default function NewsPage() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <News />
    </main>
  );
}