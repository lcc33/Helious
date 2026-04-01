const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile"; // free, fast, smart

async function callGroq(prompt: string, maxTokens = 1000): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 429) throw new Error("Rate limit hit. Wait a moment and try again.");
    throw new Error((err as any).error?.message || `Groq error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function analyzeContract(source: string, name: string): Promise<string> {
  const prompt = `You are a smart contract security expert. Analyze this Ethereum Solidity smart contract and respond ONLY with a valid JSON object in this exact format, no other text:
{
  "summary": "2-3 sentence plain English explanation of what this contract does",
  "safety_score": <number 0-100>,
  "risk_level": "safe|medium|dangerous",
  "risks": [
    {"severity": "high|medium|low", "description": "risk description"}
  ],
  "functions": [
    {"name": "functionName", "description": "what it does in plain English"}
  ]
}
Include 2-5 risks and 3-6 key functions. Respond ONLY with the JSON.

Contract (${name}):
${source.slice(0, 5000)}`;

  return callGroq(prompt, 1000);
}

export async function chatAboutContract(question: string, context: string): Promise<string> {
  const prompt = `You are a smart contract security assistant helping non-technical users understand Ethereum contracts. Answer in 2-4 plain English sentences.

Contract context: ${context}

Question: ${question}`;

  return callGroq(prompt, 400);
}