import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@site/src/components/ui/chart";
import {DailyAggregation} from "@site/src/types/quotes";
import {FC} from "react";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts";

interface TokenAreaChartProps {
  data: DailyAggregation[];
}

const config: ChartConfig = {
  promptTokens: {
    label: "Prompt",
    theme: {
      light: "#56949f",
      dark: "#9ccfd8",
    },
  },
  completionTokens: {
    label: "Completion",
    theme: {
      light: "#b4637a",
      dark: "#eb6f92",
    },
  },
};

function formatDate(date: string): string {
  const [, month, day] = date.split("-");
  return `${month}/${day}`;
}

function formatTokens(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
}

const TokenAreaChart: FC<TokenAreaChartProps> = ({ data }) => {
  return (
    <div className="flex h-full flex-col gap-2">
      <p className="text-muted-foreground m-0 text-[10px] tracking-[0.16em] uppercase">
        Tokens · 30 days
      </p>
      <ChartContainer config={config} className="aspect-auto flex-1">
        <AreaChart data={data} margin={{ top: 12, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="fill-prompt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-promptTokens)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-promptTokens)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fill-completion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-completionTokens)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-completionTokens)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="2 4" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
          />
          <YAxis
            tickFormatter={formatTokens}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => formatDate(String(value))}
                indicator="line"
              />
            }
          />
          <Area
            type="monotone"
            dataKey="promptTokens"
            stackId="tokens"
            stroke="var(--color-promptTokens)"
            fill="url(#fill-prompt)"
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="completionTokens"
            stackId="tokens"
            stroke="var(--color-completionTokens)"
            fill="url(#fill-completion)"
            strokeWidth={1.5}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default TokenAreaChart;
