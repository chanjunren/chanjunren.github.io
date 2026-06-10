import { ModelInfo, ModelResult } from "@site/src/types/mvm";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchHealth,
  fetchModels,
  HealthResponse,
  streamCompare,
} from "./mvm-client";

// Matches the backend health cache TTL.
const HEALTH_POLL_MS = 30_000;

export default function useMvm() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<Record<string, ModelResult>>({});
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const modelsLoadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const h = await fetchHealth();
        if (cancelled) return;
        setConnected(true);
        setHealth(h);
        // Retry models each poll until loaded — covers opening the page
        // before the server is up.
        if (!modelsLoadedRef.current) {
          const list = await fetchModels();
          if (cancelled) return;
          modelsLoadedRef.current = true;
          setModels(list);
          setSelectedModels(list.map((m) => m.alias));
        }
      } catch {
        if (!cancelled) {
          setConnected(false);
          setHealth(null);
        }
      }
    };
    check();
    const id = setInterval(check, HEALTH_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const toggleModel = (alias: string) => {
    setSelectedModels((prev) =>
      prev.includes(alias) ? prev.filter((m) => m !== alias) : [...prev, alias]
    );
  };

  const updateResult = (
    model: string,
    fn: (r: ModelResult) => ModelResult
  ) =>
    setResults((prev) =>
      prev[model] ? { ...prev, [model]: fn(prev[model]) } : prev
    );

  const markUnfinishedAsError = (message: string) =>
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([alias, r]) => [
          alias,
          r.status === "done" || r.status === "error"
            ? r
            : { ...r, status: "error" as const, error: message },
        ])
      )
    );

  const submit = useCallback(async () => {
    const trimmed = prompt.trim();
    if (!trimmed || selectedModels.length === 0) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSubmitError(null);
    setLoading(true);
    setResults(
      Object.fromEntries(
        selectedModels.map((alias) => [
          alias,
          { text: "", status: "idle" as const },
        ])
      )
    );

    try {
      await streamCompare(
        { prompt: trimmed, models: selectedModels },
        (ev) => {
          switch (ev.type) {
            case "model_start":
              updateResult(ev.model, (r) => ({ ...r, status: "streaming" }));
              break;
            case "token":
              updateResult(ev.model, (r) => ({
                ...r,
                text: r.text + ev.text,
              }));
              break;
            case "model_done":
              updateResult(ev.model, (r) => ({
                ...r,
                status: "done",
                usage: ev.usage,
                duration_ms: ev.duration_ms,
                total_cost_usd: ev.total_cost_usd,
              }));
              break;
            case "model_error":
              updateResult(ev.model, (r) => ({
                ...r,
                status: "error",
                error: ev.error,
              }));
              break;
          }
        },
        controller.signal
      );
      // Stream closed without a terminal event for a model only if the
      // server died mid-stream — don't leave cards spinning.
      markUnfinishedAsError("Stream ended unexpectedly");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setSubmitError(err instanceof Error ? err.message : String(err));
      markUnfinishedAsError("Connection lost");
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, [prompt, selectedModels]);

  return {
    prompt,
    setPrompt,
    selectedModels,
    toggleModel,
    connected,
    health,
    loading,
    results,
    models,
    submit,
    submitError,
  };
}
