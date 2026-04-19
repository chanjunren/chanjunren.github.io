import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { Pie } from "@visx/shape";
import { ModelAggregation } from "@site/src/types/quotes";
import { FC, useState } from "react";
import styles from "./model-donut-chart.module.css";

interface ModelDonutChartProps {
  data: ModelAggregation[];
}

const PALETTE = [
  "#0f172a",
  "#475569",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
  "#e11d48",
  "#f97316",
  "#14b8a6",
];

const ModelDonutChart: FC<ModelDonutChartProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Model mix</h3>
      <div className={styles.chartWrap}>
        <ParentSize>
          {({ width, height }) =>
            width > 0 && height > 0 ? (
              <DonutInner width={width} height={height} data={data} />
            ) : null
          }
        </ParentSize>
      </div>
    </div>
  );
};

interface InnerProps extends ModelDonutChartProps {
  width: number;
  height: number;
}

const DonutInner: FC<InnerProps> = ({ data, width, height }) => {
  const [active, setActive] = useState<string | null>(null);
  const radius = Math.min(width, height) / 2;
  const innerRadius = radius * 0.6;
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  const centerX = width / 2;
  const centerY = height / 2;

  const activeEntry = data.find((d) => d.model === active) ?? null;
  const displayModel = activeEntry?.model ?? (data[0]?.model ?? "—");
  const displayValue = activeEntry
    ? `${Math.round((activeEntry.count / total) * 100)}%`
    : `${total} total`;

  return (
    <div className={styles.inner}>
      <svg width={width} height={height}>
        <Group top={centerY} left={centerX}>
          <Pie
            data={data}
            pieValue={(d) => d.count}
            outerRadius={radius - 2}
            innerRadius={innerRadius}
            padAngle={0.02}
            cornerRadius={4}
          >
            {(pie) =>
              pie.arcs.map((arc, i) => {
                const path = pie.path(arc) ?? "";
                const isActive = active === arc.data.model;
                return (
                  <path
                    key={arc.data.model}
                    d={path}
                    fill={PALETTE[i % PALETTE.length]}
                    className={styles.slice}
                    style={{ animationDelay: `${i * 50}ms` }}
                    opacity={active && !isActive ? 0.4 : 1}
                    onMouseEnter={() => setActive(arc.data.model)}
                    onMouseLeave={() => setActive(null)}
                  />
                );
              })
            }
          </Pie>
        </Group>
      </svg>
      <div className={styles.center}>
        <div className={styles.centerModel}>{displayModel}</div>
        <div className={styles.centerValue}>{displayValue}</div>
      </div>
      <ul className={styles.legend}>
        {data.map((d, i) => (
          <li
            key={d.model}
            className={styles.legendItem}
            onMouseEnter={() => setActive(d.model)}
            onMouseLeave={() => setActive(null)}
          >
            <span
              className={styles.swatch}
              style={{ background: PALETTE[i % PALETTE.length] }}
            />
            <span className={styles.legendLabel}>{d.model}</span>
            <span className={styles.legendCount}>{d.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModelDonutChart;
