import { NextRequest, NextResponse } from "next/server";
import { chatAboutContract } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();

    if (!question || !context) {
      return NextResponse.json({ error: "Missing question or context." }, { status: 400 });
    }

    const reply = await chatAboutContract(question, context);
    return NextResponse.json({ reply: reply.trim() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}