import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import {
  Tooltip,
  defaultStyles,
  useTooltip,
  useTooltipInPortal,
} from "@visx/tooltip";
import { DailyAggregation } from "@site/src/types/quotes";
import { FC } from "react";
import styles from "./daily-bar-chart.module.css";

interface DailyBarChartProps {
  data: DailyAggregation[];
}

const MARGIN = { top: 16, right: 16, bottom: 36, left: 40 };
const BAR_COLOR = "var(--color-primary, #0f172a)";

const tooltipStyles = {
  ...defaultStyles,
  background: "rgb(15 23 42 / 0.95)",
  color: "white",
  fontSize: 12,
  padding: "6px 8px",
  borderRadius: 6,
  boxShadow: "0 4px 12px rgb(0 0 0 / 0.2)",
};

function formatDate(date: string): string {
  const [, month, day] = date.split("-");
  return `${month}/${day}`;
}

const DailyBarChart: FC<DailyBarChartProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Daily generations · last 30d</h3>
      <div className={styles.chartWrap}>
        <ParentSize>
          {({ width, height }) =>
            width > 0 && height > 0 ? (
              <BarChartInner width={width} height={height} data={data} />
            ) : null
          }
        </ParentSize>
      </div>
    </div>
  );
};

interface InnerProps extends DailyBarChartProps {
  width: number;
  height: number;
}

const BarChartInner: FC<InnerProps> = ({ data, width, height }) => {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip,
    hideTooltip,
  } = useTooltip<DailyAggregation>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  });

  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  const xScale = scaleBand<string>({
    domain: data.map((d) => d.date),
    range: [0, innerWidth],
    padding: 0.25,
  });

  const maxCount = Math.max(1, ...data.map((d) => d.count));
  const yScale = scaleLinear<number>({
    domain: [0, maxCount],
    range: [innerHeight, 0],
    nice: true,
  });

  return (
    <div ref={containerRef} className={styles.inner}>
      <svg width={width} height={height}>
        <Group left={MARGIN.left} top={MARGIN.top}>
          {data.map((d, i) => {
            const barWidth = xScale.bandwidth();
            const barHeight = innerHeight - yScale(d.count);
            const barX = xScale(d.date) ?? 0;
            const barY = innerHeight - barHeight;
            return (
              <Bar
                key={d.date}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={BAR_COLOR}
                className={styles.bar}
                style={{ animationDelay: `${i * 25}ms` }}
                onMouseMove={(e) => {
                  const rect = (
                    e.currentTarget.ownerSVGElement as SVGSVGElement
                  ).getBoundingClientRect();
                  showTooltip({
                    tooltipData: d,
                    tooltipLeft: e.clientX - rect.left,
                    tooltipTop: e.clientY - rect.top,
                  });
                }}
                onMouseLeave={hideTooltip}
              />
            );
          })}
          <AxisLeft
            scale={yScale}
            numTicks={4}
            stroke="currentColor"
            tickStroke="currentColor"
            tickLabelProps={() => ({
              fill: "currentColor",
              fontSize: 10,
              textAnchor: "end",
              dx: "-0.25em",
              dy: "0.25em",
            })}
          />
          <AxisBottom
            scale={xScale}
            top={innerHeight}
            stroke="currentColor"
            tickStroke="currentColor"
            numTicks={Math.min(data.length, 6)}
            tickFormat={(v) => formatDate(String(v))}
            tickLabelProps={() => ({
              fill: "currentColor",
              fontSize: 10,
              textAnchor: "middle",
            })}
          />
        </Group>
      </svg>
      {tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div className="font-semibold">{tooltipData.date}</div>
          <div>{tooltipData.count} quotes</div>
          <div className="opacity-70">
            {tooltipData.promptTokens + tooltipData.completionTokens} tokens
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
};

export default DailyBarChart;
