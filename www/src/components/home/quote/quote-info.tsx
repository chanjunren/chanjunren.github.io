import { QuoteContent } from "@site/src/types/quotes";
import { FC } from "react";
import { Separator } from "@site/src/components/ui/separator";

interface IQuoteInfo {
  quote: QuoteContent;
}
const QuoteInfo: FC<IQuoteInfo> = ({ quote }) => {
  const { meaning, background, pinyin } = quote;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-muted-foreground">{pinyin}</span>
      <Separator />
      <span>{meaning}</span>
      <span>{background}</span>
    </div>
  );
};

export default QuoteInfo;
