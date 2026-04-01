import Navbar from "@/components/landing/Navbar";
import ApiDocs from "@/components/landing/ApiDocs";

export default function ApiDocsPage() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <ApiDocs />
    </main>
  );
}