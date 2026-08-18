import {QuoteSummary} from "@site/src/types/quotes";
import {FC} from "react";

interface TotalQuotesProps {
  summary: QuoteSummary;
}

const TotalQuotes: FC<TotalQuotesProps> = ({ summary }) => {
  const modelCount = summary.byModel.length;
  const metrics = [
    { label: "Quotes", value: summary.totalQuotes },
    { label: "Tokens", value: summary.tokenTotals.totalTokens },
    { label: "Models", value: modelCount },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <p className="text-muted-foreground m-0 text-[10px] tracking-[0.16em] uppercase">
            {metric.label}
          </p>
          <p className="text-foreground m-0 mt-1 text-2xl font-medium tracking-tight tabular-nums sm:text-3xl">
            {metric.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TotalQuotes;
