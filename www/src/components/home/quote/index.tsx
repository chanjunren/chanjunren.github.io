import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@site/src/components/ui/hover-card";
import TypewriterText from "@site/src/components/ui/typewriter-text";
import { useMateria } from "@site/src/hooks/useMateria";
import QuoteInfo from "./quote-info";
const CHINESE_COMMA = "，";

export default function Quote() {
  const { featuredQuote, message } = useMateria();

  if (message) {
    return <TypewriterText active text={message} />;
  }

  if (!featuredQuote) {
    return null;
  }

  const quoteParts = featuredQuote.quote.split(CHINESE_COMMA);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="mb-2 flex gap-20 cursor-help">
          {/* <span
            className="text-muted-foreground letter"
            style={{ writingMode: "vertical-rl" }}
          >
            {featuredQuote.source}
          </span> */}
          {quoteParts.map((part, index) => (
            <span
              className="text-3xl tracking-widest"
              key={index}
              style={{ writingMode: "vertical-rl" }}
            >
              {part.trim()}
            </span>
          ))}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto max-w-6xl">
        <QuoteInfo quote={featuredQuote} />
      </HoverCardContent>
    </HoverCard>
  );
}
