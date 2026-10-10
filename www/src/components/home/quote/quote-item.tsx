import { InkColumn } from "@site/src/components/home/quote/ink-column";
import QuoteInfo from "@site/src/components/home/quote/quote-info";
import QuoteTable from "@site/src/components/home/quote/quote-table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@site/src/components/ui/hover-card";
import TypewriterText from "@site/src/components/ui/typewriter-text";
import { useMateria } from "@site/src/hooks/useMateria";
import { QuoteContent } from "@site/src/types/quotes";
import { FC } from "react";
const CHINESE_COMMA = "，";

interface IQuoteItem {
  quoteInfo: QuoteContent;
  display?: "simple" | "main";
}

const QuoteItem: FC<IQuoteItem> = ({ display = "simple", quoteInfo }) => {
  const quoteParts = quoteInfo.quote.split(CHINESE_COMMA);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {display === "main" ? (
          <div className="gap-20 flex flex-row-reverse cursor-help">
            {quoteParts.map((part, index) => (
              <InkColumn
                key={index}
                text={part.trim()}
                startIndex={quoteParts
                  .slice(0, index)
                  .reduce((sum, previous) => sum + [...previous.trim()].length, 0)}
                className="text-3xl"
              />
            ))}
          </div>
        ) : (
          <span className="text-lg cursor-help">{quoteInfo.quote}</span>
        )}
      </HoverCardTrigger>
      <HoverCardContent className="w-auto max-w-6xl" sideOffset={30}>
        <QuoteInfo quote={quoteInfo} />
      </HoverCardContent>
    </HoverCard>
  );
};

export default QuoteItem;
