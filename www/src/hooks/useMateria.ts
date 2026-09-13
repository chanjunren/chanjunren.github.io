import {
  MateriaPromptOutput,
  QuoteContent,
  QuotesResponse,
} from "@site/src/types/quotes";
import { useEffect, useState } from "react";
import { useMateriaApiBase } from "./useMateriaApiBase";

export function useMateria() {
  const backiesApiBase = useMateriaApiBase();
  const [quotes, setQuotes] = useState<MateriaPromptOutput[]>();
  const [featuredQuote, setFeaturedQuote] = useState<QuoteContent>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setMessage("等等。。。");
        const response = await fetch(
          `${backiesApiBase}/api/materia/quotes`
        );
        console.log("response", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: QuotesResponse = await response.json();
        setQuotes(data.quotes);
        setFeaturedQuote(data.quotes[0].content);
        setMessage(null);
      } catch (err) {
        console.error(err);
        setMessage("🤓 呵呵报错了");
      }
    };

    fetchQuotes();
  }, [backiesApiBase]);

  return { quotes, featuredQuote, message };
}
