import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaStack } from "@visx/shape";
import { DailyAggregation } from "@site/src/types/quotes";
import { FC } from "react";
import styles from "./token-area-chart.module.css";

interface TokenAreaChartProps {
  data: DailyAggregation[];
}

const MARGIN = { top: 16, right: 16, bottom: 36, left: 48 };
const KEYS = ["promptTokens", "completionTokens"] as const;
type Key = (typeof KEYS)[number];

const COLORS: Record<Key, string> = {
  promptTokens: "#0f172a",
  completionTokens: "#e11d48",
};

const LABELS: Record<Key, string> = {
  promptTokens: "Prompt",
  completionTokens: "Completion",
};

function parseDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

const TokenAreaChart: FC<TokenAreaChartProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Token usage · last 30d</h3>
        <ul className={styles.legend}>
          {KEYS.map((key) => (
            <li key={key} className={styles.legendItem}>
              <span
                className={styles.swatch}
                style={{ background: COLORS[key] }}
              />
              {LABELS[key]}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.chartWrap}>
        <ParentSize>
          {({ width, height }) =>
            width > 0 && height > 0 ? (
              <AreaInner width={width} height={height} data={data} />
            ) : null
          }
        </ParentSize>
      </div>
    </div>
  );
};

interface InnerProps extends TokenAreaChartProps {
  width: number;
  height: number;
}

const AreaInner: FC<InnerProps> = ({ data, width, height }) => {
  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  const dates = data.map((d) => parseDate(d.date));
  const xScale = scaleTime<number>({
    domain: [
      dates.length ? dates[0] : new Date(),
      dates.length ? dates[dates.length - 1] : new Date(),
    ],
    range: [0, innerWidth],
  });

  const maxStacked = Math.max(
    1,
    ...data.map((d) => d.promptTokens + d.completionTokens)
  );
  const yScale = scaleLinear<number>({
    domain: [0, maxStacked],
    range: [innerHeight, 0],
    nice: true,
  });

  return (
    <svg width={width} height={height}>
      <LinearGradient
        id="prompt-gradient"
        from={COLORS.promptTokens}
        to={COLORS.promptTokens}
        fromOpacity={0.55}
        toOpacity={0.05}
      />
      <LinearGradient
        id="completion-gradient"
        from={COLORS.completionTokens}
        to={COLORS.completionTokens}
        fromOpacity={0.55}
        toOpacity={0.05}
      />
      <Group left={MARGIN.left} top={MARGIN.top}>
        <AreaStack<DailyAggregation>
          keys={[...KEYS]}
          data={data}
          x={(d) => xScale(parseDate(d.data.date)) ?? 0}
          y0={(d) => yScale(d[0]) ?? 0}
          y1={(d) => yScale(d[1]) ?? 0}
          curve={curveMonotoneX}
        >
          {({ stacks, path }) =>
            stacks.map((stack) => {
              const key = stack.key as Key;
              return (
                <path
                  key={key}
                  d={path(stack) ?? ""}
                  fill={`url(#${
                    key === "promptTokens"
                      ? "prompt-gradient"
                      : "completion-gradient"
                  })`}
                  stroke={COLORS[key]}
                  strokeWidth={1.5}
                  className={styles.area}
                />
              );
            })
          }
        </AreaStack>
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
          tickFormat={(value) => {
            const date = value instanceof Date ? value : new Date(Number(value));
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            return `${month}/${day}`;
          }}
          tickLabelProps={() => ({
            fill: "currentColor",
            fontSize: 10,
            textAnchor: "middle",
          })}
        />
      </Group>
    </svg>
  );
};

export default TokenAreaChart;
