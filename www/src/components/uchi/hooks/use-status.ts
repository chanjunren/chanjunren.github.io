import { useEffect, useState } from "react";
import { fetchUchiStatus, type UchiStatus } from "../api";

export function useUchiStatus(apiBase: string) {
  const [status, setStatus] = useState<UchiStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchUchiStatus(apiBase, controller.signal)
      .then(setStatus)
      .catch((value: unknown) => {
        if (!controller.signal.aborted) {
          setError(value instanceof Error ? value : new Error(String(value)));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [apiBase]);

  return { status, loading, error };
}
