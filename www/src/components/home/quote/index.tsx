import QuoteInfo from "@site/src/components/home/quote/quote-info";
import QuoteItem from "@site/src/components/home/quote/quote-item";
import QuoteTable from "@site/src/components/home/quote/quote-table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@site/src/components/ui/hover-card";
import TypewriterText from "@site/src/components/ui/typewriter-text";
import { useMateria } from "@site/src/hooks/useMateria";
const CHINESE_COMMA = "，";

export default function Quote() {
  const { featuredQuote, message, quotes } = useMateria();

  if (message) {
    return <TypewriterText active text={message} />;
  }

  if (!featuredQuote) {
    return null;
  }

  const quoteParts = featuredQuote.quote.split(CHINESE_COMMA);

  return (
    <div className="flex gap-5">
      <div className="flex flex-col justify-between">
        <QuoteTable quotes={quotes} />
        <span
          className="text-muted-foreground letter tracking-widest"
          style={{ writingMode: "vertical-rl" }}
        >
          {featuredQuote.source}
        </span>
      </div>
      <QuoteItem quoteInfo={featuredQuote} display="main" />
    </div>
  );
}
