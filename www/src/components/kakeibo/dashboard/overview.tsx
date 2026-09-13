import {
  BarChartIcon,
  EnterFullScreenIcon,
  TableIcon,
} from "@radix-ui/react-icons";
import { Button } from "@site/src/components/ui/button";
import { Badge } from "@site/src/components/ui/badge";
import { Card, CardContent } from "@site/src/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@site/src/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@site/src/components/ui/dialog";
import { ErrorFallback } from "@site/src/components/ui/error-fallback";
import { LoadingFallback } from "@site/src/components/ui/loading-fallback";
import { MonoLabel } from "@site/src/components/ui/mono-label";
import { Separator } from "@site/src/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@site/src/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@site/src/components/ui/tabs";
import { type CSSProperties, type ReactNode, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { type Account, type ProcessedFile } from "../api";
import { useDashboard, useSpecs } from "../hooks";
import type { KakeiboFilters } from "./filters";

const monthlySpendChartConfig = {
  totalOut: { label: "Expenses", color: "var(--chart-1)" },
  totalIn: { label: "Revenue", color: "var(--chart-2)" },
  net: { label: "Net", color: "var(--foreground)" },
};
const spendByCategoryChartConfig = {
  total: { label: "Spend", color: "var(--foreground)" },
};
const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "2-digit",
});
function formatMonth(value: string) {
  return monthFormatter.format(new Date(`${value}-01T00:00:00`));
}
function formatAmount(value: number) {
  const absolute = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return value < 0 ? `-$${absolute}` : `$${absolute}`;
}

function formatAxisAmount(value: number) {
  const absolute = Math.round(Math.abs(value)).toLocaleString("en-US");
  return value < 0 ? `-$${absolute}` : `$${absolute}`;
}
function formatFileDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "—";
}

function LoadingCard() {
  return <LoadingFallback />;
}
function CashFlowSummary({
  totalIn,
  totalOut,
  net,
}: {
  totalIn: string;
  totalOut: string;
  net: string;
}) {
  const values = [
    { label: "Revenue", value: totalIn, color: "text-chart-2" },
    { label: "Expenses", value: totalOut, color: "text-chart-1" },
    { label: "Net", value: net, color: "text-foreground" },
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {values.map((item) => (
        <div key={item.label} className="flex flex-col gap-2">
          <MonoLabel>{item.label}</MonoLabel>
          <span
            className={`font-mono text-3xl font-semibold tracking-tight ${item.color}`}
          >
            {item.label === "Net" && (Number(item.value) < 0 ? "−" : "+")}$
            {Math.abs(Number(item.value)).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

type ChartView = "chart" | "table";

function ChartViewControls({
  view,
  onViewChange,
  onExpand,
}: {
  view: ChartView;
  onViewChange: (view: ChartView) => void;
  onExpand: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Tabs
        value={view}
        onValueChange={(value) => onViewChange(value as ChartView)}
        className="gap-0"
      >
        <TabsList className="h-8 rounded-md border p-0.5">
          <TabsTrigger
            value="chart"
            className="h-7 min-w-8 px-2"
            aria-label="Show chart"
            title="Show chart"
          >
            <BarChartIcon aria-hidden="true" />
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="h-7 min-w-8 px-2"
            aria-label="Show table"
            title="Show table"
          >
            <TableIcon aria-hidden="true" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="cursor-pointer"
        onClick={onExpand}
        aria-label="Expand graph"
        title="Expand graph"
      >
        <EnterFullScreenIcon aria-hidden="true" />
      </Button>
    </div>
  );
}

function ChartDialog({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-[min(1100px,calc(100%-1.5rem))] overflow-y-auto p-6 sm:max-w-[min(1100px,calc(100%-3rem))]"
        style={
          {
            "--chart-1": "#b4637a",
            "--chart-2": "#286983",
            "--foreground": "#575279",
          } as CSSProperties
        }
      >
        <DialogHeader>
          <DialogTitle>
            <MonoLabel>{title}</MonoLabel>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Expanded graph view
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function MonthlySpendChart({
  monthlySpend,
}: {
  monthlySpend: Array<{
    month: string;
    totalOut: string;
    totalIn: string;
    net: string;
  }>;
}) {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    totalIn: true,
    totalOut: true,
    net: true,
  });
  const [view, setView] = useState<ChartView>("chart");
  const [expanded, setExpanded] = useState(false);
  const toggleSeries = (key: string) =>
    setVisibleSeries((current) => ({ ...current, [key]: !current[key] }));
  const chartData = monthlySpend.map((item) => ({
    ...item,
    totalOut: Number(item.totalOut),
    totalIn: Number(item.totalIn),
    net: Number(item.net),
  }));
  const table = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
          <TableHead className="text-right">Expenses</TableHead>
          <TableHead className="text-right">Net</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {chartData.map((item) => (
          <TableRow key={item.month}>
            <TableCell>{formatMonth(item.month)}</TableCell>
            <TableCell className="text-right font-mono">
              {formatAmount(item.totalIn)}
            </TableCell>
            <TableCell className="text-right font-mono">
              {formatAmount(item.totalOut)}
            </TableCell>
            <TableCell className="text-right font-mono">
              {formatAmount(item.net)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  const renderChart = (isExpanded: boolean) => (
    <ChartContainer
      config={monthlySpendChartConfig}
      className={`w-full aspect-auto ${isExpanded ? "h-[32rem]" : "h-56"}`}
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 12, right: 12, top: 12, bottom: 8 }}
      >
        <CartesianGrid vertical={false} />
        <ReferenceLine y={0} stroke="var(--border)" strokeWidth={2} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          tick={{ fontSize: 14 }}
          tickFormatter={formatMonth}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={76}
          tick={{ fontSize: 14 }}
          tickFormatter={(value) => formatAxisAmount(Number(value))}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              className="text-sm"
              formatter={(value, name) => (
                <div className="flex min-w-36 items-center justify-between gap-4">
                  <span>
                    {monthlySpendChartConfig[
                      String(name) as keyof typeof monthlySpendChartConfig
                    ]?.label ?? String(name)}
                  </span>
                  <span className="font-mono font-medium">
                    {formatAmount(Number(value))}
                  </span>
                </div>
              )}
            />
          }
        />
        {visibleSeries.totalIn && (
          <Line
            dataKey="totalIn"
            type="monotone"
            stroke={monthlySpendChartConfig.totalIn.color}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
        {visibleSeries.totalOut && (
          <Line
            dataKey="totalOut"
            type="monotone"
            stroke={monthlySpendChartConfig.totalOut.color}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
        {visibleSeries.net && (
          <Line
            dataKey="net"
            type="monotone"
            stroke={monthlySpendChartConfig.net.color}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
      </LineChart>
    </ChartContainer>
  );
  const chart = renderChart(false);
  const content = view === "table" ? table : chart;
  return (
    <section className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <MonoLabel>Monthly performance</MonoLabel>
        <ChartViewControls
          view={view}
          onViewChange={setView}
          onExpand={() => setExpanded(true)}
        />
      </div>
      {content}
      {view === "chart" && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {Object.entries(monthlySpendChartConfig).map(([key, config]) => (
            <button
              key={key}
              type="button"
              aria-pressed={visibleSeries[key]}
              onClick={() => toggleSeries(key)}
              className={`flex cursor-pointer items-center gap-2 rounded-md border border-transparent bg-transparent px-2 py-1.5 transition-colors ${visibleSeries[key] ? "text-foreground" : "text-muted-foreground"}`}
            >
              <span
                aria-hidden="true"
                className="size-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <MonoLabel className="text-inherit">{config.label}</MonoLabel>
            </button>
          ))}
        </div>
      )}
      <ChartDialog
        open={expanded}
        onOpenChange={setExpanded}
        title="Monthly performance"
      >
        {view === "table" ? table : renderChart(true)}
        {view === "chart" && (
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(monthlySpendChartConfig).map(([key, config]) => (
              <button
                key={key}
                type="button"
                aria-pressed={visibleSeries[key]}
                onClick={() => toggleSeries(key)}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${visibleSeries[key] ? "text-foreground" : "text-muted-foreground"}`}
              >
                <span
                  aria-hidden="true"
                  className="size-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <MonoLabel className="text-inherit">{config.label}</MonoLabel>
              </button>
            ))}
          </div>
        )}
      </ChartDialog>
    </section>
  );
}

function SpendByCategoryChart({
  spendByCategory,
  categories,
}: {
  spendByCategory: Array<{ categoryId: number; total: string; count: number }>;
  categories: Record<string, { id: number; name: string }>;
}) {
  const data = spendByCategory
    .map((item) => ({
      ...item,
      category: categories[String(item.categoryId)]?.name ?? "Unknown",
      total: Number(item.total),
    }))
    .sort((left, right) => right.total - left.total);
  const [view, setView] = useState<ChartView>("chart");
  const [expanded, setExpanded] = useState(false);
  const table = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Transactions</TableHead>
          <TableHead className="text-right">Spend</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.categoryId}>
            <TableCell>{item.category}</TableCell>
            <TableCell className="text-right font-mono">{item.count}</TableCell>
            <TableCell className="text-right font-mono">
              {formatAmount(item.total)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  const renderChart = (isExpanded: boolean) => (
    <ChartContainer
      config={spendByCategoryChartConfig}
      className="w-full aspect-auto"
      style={{
        height: isExpanded
          ? Math.max(420, data.length * 52)
          : Math.max(220, data.length * 32),
      }}
    >
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: 8, right: 24, top: 8, bottom: 8 }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="category"
          type="category"
          tickLine={false}
          axisLine={false}
          width={132}
          tick={{ fontSize: isExpanded ? 14 : 12 }}
        />
        <XAxis
          dataKey="total"
          type="number"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: isExpanded ? 14 : 12 }}
          tickFormatter={(value) => formatAmount(Number(value))}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              className="text-sm"
              formatter={(value, _name, item) => (
                <div className="flex min-w-44 items-center justify-between gap-4">
                  <span>{String(item.payload.category)}</span>
                  <span className="font-mono font-medium">
                    {formatAmount(Number(value))}
                  </span>
                </div>
              )}
            />
          }
        />
        <Bar
          dataKey="total"
          fill={spendByCategoryChartConfig.total.color}
          radius={6}
          maxBarSize={28}
        />
      </BarChart>
    </ChartContainer>
  );
  const chart = renderChart(false);
  return (
    <section className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <MonoLabel>Spend by category</MonoLabel>
        <ChartViewControls
          view={view}
          onViewChange={setView}
          onExpand={() => setExpanded(true)}
        />
      </div>
      {view === "table" ? table : chart}
      <ChartDialog
        open={expanded}
        onOpenChange={setExpanded}
        title="Spend by category"
      >
        {view === "table" ? table : renderChart(true)}
      </ChartDialog>
    </section>
  );
}

function ProcessedFilesTable({
  processedFiles,
  accounts,
}: {
  processedFiles: Array<ProcessedFile>;
  accounts: Array<Account>;
}) {
  return (
    <section>
      <MonoLabel>Processed files</MonoLabel>
      <div className="mt-4">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Statement period</TableHead>
              <TableHead>Processed</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedFiles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No files processed in this range.
                </TableCell>
              </TableRow>
            ) : (
              processedFiles.map((file) => (
                <TableRow key={file.sourceFileId}>
                  <TableCell>
                    <span className="font-medium">{file.fileName}</span>
                  </TableCell>
                  <TableCell>
                    {file.accountId
                      ? (accounts.find(
                          (account) => account.id === file.accountId,
                        )?.displayName ?? `Account ${file.accountId}`)
                      : "Unknown account"}
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatFileDate(file.periodStart)} –{" "}
                    {formatFileDate(file.periodEnd)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatFileDate(file.processedAt)}
                  </TableCell>
                  <TableCell>
                    {file.status === "success" ? (
                      <Badge
                        variant="outline"
                        className="border-chart-2/30 bg-chart-2/10 text-chart-2"
                      >
                        {file.status}
                      </Badge>
                    ) : (
                      <span className="font-medium capitalize">
                        {file.status}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export function Overview({ filters }: { filters: KakeiboFilters }) {
  const dashboard = useDashboard(filters, filters.accountId);
  const specs = useSpecs();
  if (dashboard.isPending || specs.isPending) return <LoadingCard />;
  if (dashboard.isError)
    return <ErrorFallback onRetry={() => void dashboard.refetch()} />;
  if (specs.isError)
    return <ErrorFallback onRetry={() => void specs.refetch()} />;
  if (!dashboard.data || !specs.data) return <ErrorFallback />;
  return (
    <div className="flex flex-col gap-4 pt-4">
      <Card>
        <CardContent className="space-y-8">
          <CashFlowSummary
            totalIn={dashboard.data.totalIn}
            totalOut={dashboard.data.totalOut}
            net={dashboard.data.net}
          />
          <div>
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
              <MonthlySpendChart monthlySpend={dashboard.data.monthlySpend} />
              <SpendByCategoryChart
                spendByCategory={dashboard.data.spendByCategory}
                categories={specs.data.categories}
              />
            </div>
          </div>
          <Separator />
          <ProcessedFilesTable
            processedFiles={dashboard.data.processedFiles ?? []}
            accounts={specs.data.accounts}
          />
        </CardContent>
      </Card>
    </div>
  );
}
