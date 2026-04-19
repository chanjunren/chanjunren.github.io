import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@site/src/components/ui/card";
import { QuoteSummary } from "@site/src/types/quotes";
import { FC, useMemo } from "react";

interface SummaryKpisProps {
  summary: QuoteSummary;
}

function formatNumber(value: number): string {
  return value.toLocaleString();
}

const SummaryKpis: FC<SummaryKpisProps> = ({ summary }) => {
  const topModel = useMemo(() => {
    if (!summary.byModel.length) return "—";
    return summary.byModel.reduce((acc, cur) =>
      cur.count > acc.count ? cur : acc
    ).model;
  }, [summary.byModel]);

  const items = [
    {
      label: "TOTAL QUOTES",
      value: formatNumber(summary.totalQuotes),
      hint: "all-time generations",
    },
    {
      label: "TOTAL TOKENS",
      value: formatNumber(summary.tokenTotals.totalTokens),
      hint: `${formatNumber(
        summary.tokenTotals.promptTokens
      )} prompt · ${formatNumber(
        summary.tokenTotals.completionTokens
      )} completion`,
    },
    {
      label: "TOP MODEL",
      value: topModel,
      hint: `${summary.byModel.length} model${
        summary.byModel.length === 1 ? "" : "s"
      } used`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="gap-2 py-4">
          <CardHeader>
            <CardDescription className="text-xs tracking-widest">
              {item.label}
            </CardDescription>
            <CardTitle className="truncate text-2xl font-semibold">
              {item.value}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-xs">
            {item.hint}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryKpis;
