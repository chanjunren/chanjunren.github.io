export type ModelInfo = {
  alias: string;
  name: string;
  description: string;
};

export type ModelResultStatus = "idle" | "streaming" | "done" | "error";

export type ModelUsage = {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
};

export type ModelResult = {
  text: string;
  status: ModelResultStatus;
  usage?: ModelUsage;
  duration_ms?: number;
  total_cost_usd?: number;
  error?: string;
};

export type CompareRequest = {
  prompt: string;
  models: string[];
  system_prompt?: string;
};
