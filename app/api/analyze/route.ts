import { NextRequest, NextResponse } from "next/server";
import { fetchContractSource } from "@/lib/etherscan";
import { analyzeContract } from "@/lib/groq";
import { AnalysisResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    
    const { address } = await req.json();

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: "Invalid Ethereum address." }, { status: 400 });
    }

    const { source, name } = await fetchContractSource(address);
    const raw = await analyzeContract(source, name);
    

    let parsed: AnalysisResult;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      return NextResponse.json(
        { error: "AI returned an unparseable response. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ...parsed, contractName: name });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}