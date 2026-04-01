export interface Risk {
  severity: "high" | "medium" | "low";
  description: string;
}

export interface ContractFunction {
  name: string;
  description: string;
}

export interface AnalysisResult {
  contractName: string;
  summary: string;
  safety_score: number;
  risk_level: "safe" | "medium" | "dangerous";
  risks: Risk[];
  functions: ContractFunction[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}