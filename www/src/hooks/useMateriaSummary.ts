import { QuoteSummary } from "@site/src/types/quotes";
import { useEffect, useState } from "react";
import { useMateriaApiBase } from "./useMateriaApiBase";

export function useMateriaSummary() {
  const backiesApiBase = useMateriaApiBase();
  const [summary, setSummary] = useState<QuoteSummary | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setMessage("等等。。。");
        const response = await fetch(
          `${backiesApiBase}/api/materia/quotes/summary`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: QuoteSummary = await response.json();
        setSummary(data);
        setMessage(null);
      } catch (err) {
        console.error(err);
        setMessage("🤓 呵呵报错了");
      }
    };

    fetchSummary();
  }, [backiesApiBase]);

  return { summary, message };
}
