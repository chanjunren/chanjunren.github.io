import QuoteItem from "@site/src/components/home/quote/quote-item";
import QuoteStatistics from "@site/src/components/home/quote/quote-statistics";
import QuoteTable from "@site/src/components/home/quote/quote-table";
import TypewriterText from "@site/src/components/ui/typewriter-text";
import { useMateria } from "@site/src/hooks/useMateria";
const CHINESE_COMMA = "，";

export default function Quote() {
  const { featuredQuote, message, quotes } = useMateria();

  if (message) {
    return <TypewriterText active text={message} />;
  }

  if (!featuredQuote || !quotes) {
    return null;
  }

  const quoteParts = featuredQuote.quote.split(CHINESE_COMMA);

  return (
    <div className="flex gap-5">
      <div className="flex flex-col justify-between">
        <div className={"flex flex-col gap-2"}>
          <QuoteTable quotes={quotes} />
          <QuoteStatistics />
        </div>
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
