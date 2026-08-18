import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@site/src/components/ui/chart";
import { ModelAggregation } from "@site/src/types/quotes";
import { FC, useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

interface ModelDonutChartProps {
  data: ModelAggregation[];
}

const ModelLegend: FC<ModelDonutChartProps> = ({ data }) => (
  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 pt-2">
    {data.map((item, index) => (
      <span
        key={item.model}
        className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-[10px]"
      >
        <span
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: `var(--color-model${index})` }}
        />
        <span className="truncate">{item.model}</span>
      </span>
    ))}
  </div>
);

const PALETTE: Array<{ light: string; dark: string }> = [
  { light: "#b4637a", dark: "#eb6f92" }, // love
  { light: "#907aa9", dark: "#c4a7e7" }, // iris
  { light: "#d7827e", dark: "#ebbcba" }, // rose
  { light: "#ea9d34", dark: "#f6c177" }, // gold
];

const ModelDonutChart: FC<ModelDonutChartProps> = ({ data }) => {
  const config = useMemo<ChartConfig>(() => {
    const out: ChartConfig = { count: { label: "Quotes" } };
    data.forEach((d, i) => {
      out[`model${i}`] = {
        label: d.model,
        theme: PALETTE[i % PALETTE.length],
      };
    });
    return out;
  }, [data]);

  return (
    <div className="flex h-full flex-col gap-2">
      <p className="text-muted-foreground m-0 text-[10px] tracking-[0.16em] uppercase">
        By model
      </p>
      <ChartContainer config={config} className="aspect-auto flex-1">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="model" hideLabel />}
          />
          <ChartLegend content={<ModelLegend data={data} />} verticalAlign="bottom" />
          <Pie
            data={data}
            dataKey="count"
            nameKey="model"
            innerRadius="58%"
            outerRadius="78%"
            paddingAngle={3}
            rootTabIndex={-1}
            strokeWidth={0}
          >
            {data.map((d, index) => (
              <Cell
                key={d.model}
                fill={`var(--color-model${index})`}
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default ModelDonutChart;
