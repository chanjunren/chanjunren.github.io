import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@site/src/components/ui/chart";
import {DailyAggregation} from "@site/src/types/quotes";
import {FC} from "react";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";

interface DailyBarChartProps {
  data: DailyAggregation[];
}

const config: ChartConfig = {
  count: {
    label: "Quotes",
    theme: {
      light: "#907aa9",
      dark: "#c4a7e7",
    },
  },
};

function formatDate(date: string): string {
  const [, month, day] = date.split("-");
  return `${month}/${day}`;
}

const DailyBarChart: FC<DailyBarChartProps> = ({ data }) => {
  return (
    <div className="flex h-full flex-col gap-2">
      <h3 className="text-[--reduced-emphasis-color] m-0 text-[8px] font-medium tracking-[0.2em] uppercase">
        [Daily generations · last 30d]
      </h3>
      <ChartContainer config={config} className="aspect-auto flex-1">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
          />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => formatDate(String(value))}
              />
            }
          />
          <Bar dataKey="count" fill="var(--color-count)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default DailyBarChart;
