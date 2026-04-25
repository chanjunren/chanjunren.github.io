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

const TokenAreaChart: FC<TokenAreaChartProps> = ({ data }) => {
  return (
    <div className="flex h-full flex-col gap-2">
      <h3 className="text-muted-foreground/60 m-0 text-[8px] font-medium tracking-[0.2em] uppercase">
        [Token usage · last 30d]
      </h3>
      <ChartContainer config={config} className="aspect-auto flex-1">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="fill-prompt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-promptTokens)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-promptTokens)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fill-completion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-completionTokens)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-completionTokens)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
          />
          <YAxis tickLine={false} axisLine={false} width={40} />
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
          />
          <Area
            type="monotone"
            dataKey="completionTokens"
            stackId="tokens"
            stroke="var(--color-completionTokens)"
            fill="url(#fill-completion)"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default TokenAreaChart;
