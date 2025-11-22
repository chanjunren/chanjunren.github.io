import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@site/src/components/ui/HoverCard";
import TypewriterText from "../common/TypewriterText";
import { useMateria } from "../home/hooks/useMateria";
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
          <span
            className="text-muted-foreground"
            style={{ writingMode: "vertical-rl" }}
          >
            {featuredQuote.source}
          </span>
          {quoteParts.map((part, index) => (
            <span
              className="text-2xl"
              key={index}
              style={{ writingMode: "vertical-rl" }}
            >
              {part.trim()}
            </span>
          ))}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80"></HoverCardContent>
    </HoverCard>
  );
}
