import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Products from "@/components/landing/Products";

export default function LandingPage() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Products />
    </main>
  );
}