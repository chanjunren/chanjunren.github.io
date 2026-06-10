import { MVM_API_BASE } from "@site/src/constants/api";
import { CompareRequest, ModelInfo, ModelUsage } from "@site/src/types/mvm";

export type HealthResponse = {
  status: "ok" | "degraded";
  cli_installed: boolean;
  cli_authenticated: boolean;
  auth_method?: string;
  email?: string;
  error?: string;
};

export type CompareEvent =
  | { type: "model_start"; model: string }
  | { type: "token"; model: string; text: string }
  | {
      type: "model_done";
      model: string;
      duration_ms: number;
      total_cost_usd: number;
      usage: ModelUsage;
    }
  | { type: "model_error"; model: string; error: string }
  | { type: "done" };

export async function fetchModels(signal?: AbortSignal): Promise<ModelInfo[]> {
  const res = await fetch(`${MVM_API_BASE}/api/mvm/models`, { signal });
  if (!res.ok) throw new Error(`models request failed: HTTP ${res.status}`);
  return (await res.json()).models;
}

export async function fetchHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const res = await fetch(`${MVM_API_BASE}/api/mvm/health`, { signal });
  if (!res.ok) throw new Error(`health request failed: HTTP ${res.status}`);
  return res.json();
}

export async function streamCompare(
  req: CompareRequest,
  onEvent: (ev: CompareEvent) => void,
  signal: AbortSignal
): Promise<void> {
  const res = await fetch(`${MVM_API_BASE}/api/mvm/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });

  // Validation failures arrive as plain 400 JSON {error, code}, not SSE.
  const contentType = res.headers.get("content-type") ?? "";
  if (!res.ok || !contentType.includes("text/event-stream")) {
    let message = `compare failed: HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // non-JSON error body; keep generic message
    }
    throw new Error(message);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const dispatchFrame = (frame: string) => {
    let name = "";
    const dataLines: string[] = [];
    for (const line of frame.split("\n")) {
      if (line.startsWith("event:")) name = line.slice("event:".length).trim();
      else if (line.startsWith("data:")) {
        dataLines.push(line.slice("data:".length).trimStart());
      }
    }
    if (!name) return;
    const data = dataLines.join("\n");
    onEvent({ type: name, ...(data ? JSON.parse(data) : {}) } as CompareEvent);
  };

  // Frames can split across network chunks — buffer until "\n\n".
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      if (frame.trim()) dispatchFrame(frame);
    }
  }
}
