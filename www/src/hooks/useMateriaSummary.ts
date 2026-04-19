import { BACKIES_API_BASE } from "@site/src/constants/api";
import { QuoteSummary } from "@site/src/types/quotes";
import { useEffect, useState } from "react";

export function useMateriaSummary() {
  const [summary, setSummary] = useState<QuoteSummary | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setMessage("等等。。。");
        const response = await fetch(
          `${BACKIES_API_BASE}/api/materia/quotes/summary`
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
  }, []);

  return { summary, message };
}
