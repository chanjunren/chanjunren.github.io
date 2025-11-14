import {
  MateriaPromptOutput,
  QuoteContent,
  QuotesResponse,
} from "@site/src/types/quotes";
import { useEffect, useState } from "react";

export function useMateria() {
  const [quotes, setQuotes] = useState<MateriaPromptOutput[]>();
  const [featuredQuote, setFeaturedQuote] = useState<QuoteContent>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setMessage("等等。。。");
        const response = await fetch(
          "https://backies-222389637273.asia-southeast1.run.app/api/materia/quotes"
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
  }, []);

  return { quotes, featuredQuote, message };
}
