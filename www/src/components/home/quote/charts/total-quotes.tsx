import {QuoteSummary} from "@site/src/types/quotes";
import {FC} from "react";

interface TotalQuotesProps {
  summary: QuoteSummary;
}

const TotalQuotes: FC<TotalQuotesProps> = ({ summary }) => {
  const modelCount = summary.byModel.length;
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <span className="text-foreground text-7xl font-semibold tabular-nums">
          {summary.totalQuotes.toLocaleString()}
        </span>
        <span className="text-muted-foreground text-xs">
          {summary.tokenTotals.totalTokens.toLocaleString()} tokens ·{" "}
          {modelCount} model{modelCount === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
};

export default TotalQuotes;
