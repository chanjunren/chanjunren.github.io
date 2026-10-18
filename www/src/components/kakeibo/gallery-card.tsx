import { Card } from "@site/src/components/ui/card";
import { ChartContainer } from "@site/src/components/ui/chart";
import { MonoLabel } from "@site/src/components/ui/mono-label";
import { cn } from "@site/src/lib/utils";
import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { formatAmount } from "./dashboard/overview";
import {
  cardMonthlySpend,
  mockDashboardResponse,
  monthlySpendChartConfig,
  spendByCategory,
  spendByCategoryChartConfig,
} from "./data";
import { mockupTheme } from "./mockup";
import styles from "./gallery-card.module.css";

const SCENE_WIDTH = 600;
const SCENE_HEIGHT = 345;

const monthFormatter = new Intl.DateTimeFormat("en", { month: "short" });

function useSceneScale(ref: RefObject<HTMLElement | null>) {
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(width / SCENE_WIDTH, height / SCENE_HEIGHT));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return scale;
}

// Touch screens have no hover, so the deck fans out once it scrolls into view.
function useFanOnView(ref: RefObject<HTMLElement | null>) {
  const [fanned, setFanned] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.matchMedia("(hover: none)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFanned(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return fanned;
}

function Widget({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Card className="h-full gap-3 px-5 py-4 shadow-xl">
      <MonoLabel className="text-sm">{label}</MonoLabel>
      {children}
    </Card>
  );
}

function NetWidget() {
  const { totalIn, totalOut, net } = mockDashboardResponse;
  return (
    <Widget label="Net">
      <span className="font-mono text-3xl font-semibold tracking-tight">
        +{formatAmount(Number(net))}
      </span>
      <div className="mt-auto flex gap-5 font-mono">
        <div className="flex flex-col gap-1">
          <MonoLabel className="text-xs">Revenue</MonoLabel>
          <span className="font-semibold text-chart-2">
            {formatAmount(Number(totalIn))}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <MonoLabel className="text-xs">Expenses</MonoLabel>
          <span className="font-semibold text-chart-1">
            {formatAmount(Number(totalOut))}
          </span>
        </div>
      </div>
    </Widget>
  );
}

function MonthlyWidget() {
  return (
    <Widget label="Monthly performance">
      <ChartContainer
        config={monthlySpendChartConfig}
        className="aspect-auto min-h-0 w-full flex-1"
      >
        <LineChart
          data={cardMonthlySpend}
          margin={{ left: 8, right: 8, top: 6, bottom: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tick={{ fontSize: 10 }}
            tickFormatter={(value) =>
              monthFormatter.format(new Date(`${value}-01T00:00:00`))
            }
          />
          {(["totalIn", "totalOut", "net"] as const).map((key) => (
            <Line
              key={key}
              dataKey={key}
              type="monotone"
              stroke={monthlySpendChartConfig[key].color}
              strokeWidth={2.5}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
      <div className="flex justify-center gap-3">
        {Object.entries(monthlySpendChartConfig).map(([key, config]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <MonoLabel className="text-xs text-foreground">
              {config.label}
            </MonoLabel>
          </span>
        ))}
      </div>
    </Widget>
  );
}

function CategoryWidget() {
  return (
    <Widget label="Spend by category">
      <ChartContainer
        config={spendByCategoryChartConfig}
        className="aspect-auto min-h-0 w-full flex-1"
      >
        <BarChart
          data={spendByCategory}
          layout="vertical"
          margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        >
          <YAxis
            dataKey="category"
            type="category"
            tickLine={false}
            axisLine={false}
            width={88}
            tick={{ fontSize: 11 }}
          />
          <XAxis dataKey="total" type="number" hide />
          <Bar
            dataKey="total"
            fill={spendByCategoryChartConfig.total.color}
            radius={6}
            maxBarSize={18}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
    </Widget>
  );
}

export default function KakeiboGalleryCard({
  onClick,
}: {
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const scale = useSceneScale(cardRef);
  const fanned = useFanOnView(cardRef);

  return (
    <div
      ref={cardRef}
      data-fanned={fanned}
      className={cn(
        "relative flex-grow cursor-pointer overflow-hidden rounded-lg shadow-md",
        styles.card,
      )}
      onClick={onClick}
    >
      {scale !== null && (
        <div
          aria-hidden="true"
          className={cn(styles.scene, "text-foreground")}
          style={{ ...mockupTheme, "--scene-scale": scale } as CSSProperties}
        >
          <div className={cn(styles.widget, styles.left)}>
            <CategoryWidget />
          </div>
          <div className={cn(styles.widget, styles.right)}>
            <NetWidget />
          </div>
          <div className={cn(styles.widget, styles.middle)}>
            <MonthlyWidget />
          </div>
        </div>
      )}
    </div>
  );
}
