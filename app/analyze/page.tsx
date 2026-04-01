import { Suspense } from "react";
import ContractAnalyzer from "@/components/ContractAnalyzer";

export default function AnalyzePage() {
  return (
    <Suspense fallback={null}>
      <main className="min-h-screen bg-white">
        <ContractAnalyzer />
      </main>
    </Suspense>
  );
}