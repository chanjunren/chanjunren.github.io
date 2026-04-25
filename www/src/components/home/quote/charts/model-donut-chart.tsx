import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@site/src/components/ui/chart";
import { ModelAggregation } from "@site/src/types/quotes";
import { FC, useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

interface ModelDonutChartProps {
  data: ModelAggregation[];
}

const PALETTE: Array<{ light: string; dark: string }> = [
  { light: "#b4637a", dark: "#eb6f92" }, // love
  { light: "#907aa9", dark: "#c4a7e7" }, // iris
  { light: "#d7827e", dark: "#ebbcba" }, // rose
  { light: "#ea9d34", dark: "#f6c177" }, // gold
];

const ModelDonutChart: FC<ModelDonutChartProps> = ({ data }) => {
  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.count, 0),
    [data]
  );

  const config = useMemo<ChartConfig>(() => {
    const out: ChartConfig = { count: { label: "Quotes" } };
    data.forEach((d, i) => {
      out[d.model] = {
        label: d.model,
        theme: PALETTE[i % PALETTE.length],
      };
    });
    return out;
  }, [data]);

  return (
    <div className="flex h-full flex-col gap-2">
      <h3 className="text-muted-foreground/60 m-0 text-[8px] font-medium tracking-[0.2em] uppercase">
        [Model mix]
      </h3>
      <ChartContainer config={config} className="aspect-auto flex-1">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="model" hideLabel />}
          />
          <ChartLegend
            content={<ChartLegendContent nameKey="model" />}
            verticalAlign="bottom"
          />
          <Pie
            data={data}
            dataKey="count"
            nameKey="model"
            innerRadius="50%"
            outerRadius="80%"
            paddingAngle={2}
            strokeWidth={2}
          >
            {data.map((d) => (
              <Cell key={d.model} fill={`var(--color-${d.model})`} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                  return null;
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-semibold"
                    >
                      {total}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 20}
                      className="fill-muted-foreground text-xs"
                    >
                      quotes
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default ModelDonutChart;
