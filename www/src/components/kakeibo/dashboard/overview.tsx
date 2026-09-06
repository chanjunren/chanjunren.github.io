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
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@site/src/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@site/src/components/ui/chart";
import { MonoLabel } from "@site/src/components/ui/mono-label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@site/src/components/ui/table";
import { type Account, type MonthRange, type ProcessedFile } from "../api";
import { useDashboard, useSpecs } from "../hooks";

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
  return (
    <Card className="mt-4">
      <CardContent className="py-8 text-base text-muted-foreground">
        Loading dashboard…
      </CardContent>
    </Card>
  );
}
function ErrorCard({ message }: { message: string }) {
  return (
    <Card className="mt-4">
      <CardContent className="py-8 text-base text-destructive">
        {message}
      </CardContent>
    </Card>
  );
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
    <Card>
      <CardHeader>
        <CardTitle>
          <MonoLabel>Cash flow</MonoLabel>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-3">
        {values.map((item) => (
          <div key={item.label} className="flex flex-col gap-2">
            <MonoLabel>{item.label}</MonoLabel>
            <span
              className={`font-mono text-3xl font-semibold tracking-tight ${item.color}`}
            >
              {item.label === "Net" &&
                (Number(item.value) < 0 ? "−" : "+")}
              $
              {Math.abs(Number(item.value)).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
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
  const toggleSeries = (key: string) =>
    setVisibleSeries((current) => ({ ...current, [key]: !current[key] }));
  const chartData = monthlySpend.map((item) => ({
    ...item,
    totalOut: Number(item.totalOut),
    totalIn: Number(item.totalIn),
    net: Number(item.net),
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <MonoLabel>Monthly performance</MonoLabel>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={monthlySpendChartConfig}
          className="h-80 w-full aspect-auto"
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
                stroke="var(--color-totalIn)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {visibleSeries.totalOut && (
              <Line
                dataKey="totalOut"
                type="monotone"
                stroke="var(--color-totalOut)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {visibleSeries.net && (
              <Line
                dataKey="net"
                type="monotone"
                stroke="var(--color-net)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ChartContainer>
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
      </CardContent>
    </Card>
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
  const chartHeight = Math.max(260, data.length * 48);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <MonoLabel>Spend by category</MonoLabel>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={spendByCategoryChartConfig}
          className="w-full aspect-auto"
          style={{ height: chartHeight }}
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
              tick={{ fontSize: 14 }}
            />
            <XAxis
              dataKey="total"
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 14 }}
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
              fill="var(--color-total)"
              radius={6}
              maxBarSize={28}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
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
    <Card>
      <CardHeader>
        <CardTitle>
          <MonoLabel>Processed files</MonoLabel>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
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
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
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
                  <TableCell className="font-mono text-sm">
                    {formatFileDate(file.periodStart)} – {formatFileDate(file.periodEnd)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatFileDate(file.processedAt)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium capitalize">{file.status}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function Overview({
  range,
  accountId,
}: {
  range: MonthRange;
  accountId?: number;
}) {
  const dashboard = useDashboard(range, accountId);
  const specs = useSpecs();
  if (dashboard.isPending || specs.isPending) return <LoadingCard />;
  if (dashboard.isError) return <ErrorCard message={dashboard.error.message} />;
  if (specs.isError) return <ErrorCard message={specs.error.message} />;
  if (!dashboard.data || !specs.data)
    return <ErrorCard message="Dashboard data is unavailable." />;
  return (
    <div className="flex flex-col gap-4 pt-4">
      <CashFlowSummary
        totalIn={dashboard.data.totalIn}
        totalOut={dashboard.data.totalOut}
        net={dashboard.data.net}
      />
      <MonthlySpendChart monthlySpend={dashboard.data.monthlySpend} />
      <SpendByCategoryChart
        spendByCategory={dashboard.data.spendByCategory}
        categories={specs.data.categories}
      />
      <ProcessedFilesTable
        processedFiles={dashboard.data.processedFiles ?? []}
        accounts={specs.data.accounts}
      />
    </div>
  );
}
