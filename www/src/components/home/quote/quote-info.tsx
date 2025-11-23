import { QuoteContent } from "@site/src/types/quotes";
import { FC } from "react";
import { Separator } from "@site/src/components/ui/separator";

interface IQuoteInfo {
  quote: QuoteContent;
}
const QuoteInfo: FC<IQuoteInfo> = ({ quote }) => {
  const { meaning, background, pinyin, sourceInfo } = quote;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-muted-foreground">{pinyin}</span>
      <Separator />
      <span>{meaning}</span>
      <br />
      <span>{background}</span>
      <Separator />
      <span>{sourceInfo}</span>
    </div>
  );
};

export default QuoteInfo;
