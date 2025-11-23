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
        <div className="mb-2 flex cursor-help gap-8">
          <span
            className="text-muted-foreground letter tracking-widest self-end"
            style={{ writingMode: "vertical-rl" }}
          >
            {featuredQuote.source}
          </span>
          <div className="gap-20 flex flex-row-reverse">
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
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto max-w-6xl" sideOffset={30}>
        <QuoteInfo quote={featuredQuote} />
      </HoverCardContent>
    </HoverCard>
  );
}
