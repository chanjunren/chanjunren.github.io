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
import { useState } from "react";
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
import {
  mockDashboardResponse,
  monthlySpend,
  monthlySpendChartConfig,
  spendByCategory,
  spendByCategoryChartConfig,
} from "../data";

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
function formatJobDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function CashFlowSummary() {
  const values = [
    {
      label: "Revenue",
      value: mockDashboardResponse.totalIn,
      color: "text-chart-2",
    },
    {
      label: "Expenses",
      value: mockDashboardResponse.totalOut,
      color: "text-chart-1",
    },
    { label: "Net", value: mockDashboardResponse.net, color: "text-foreground" },
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
              {Number(item.value) < 0 ? "−" : "+"}$
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

function LatestJobRun() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <MonoLabel>Ingest runs</MonoLabel>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead className="text-right">Files</TableHead>
              <TableHead className="text-right">Transactions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDashboardResponse.jobRuns.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <span className="font-medium capitalize">{job.status}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {formatJobDate(job.completedAt)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-mono">
                    {job.result.files_processed}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-mono">
                    {job.result.transactions_inserted}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MonthlySpendChart() {
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    totalIn: true,
    totalOut: true,
    net: true,
  });
  const toggleSeries = (key: string) =>
    setVisibleSeries((current) => ({ ...current, [key]: !current[key] }));
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
            data={monthlySpend}
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
              tickFormatter={(value) => formatAmount(Number(value))}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="text-sm"
                  formatter={(value, name) => (
                    <div className="flex min-w-36 items-center justify-between gap-4">
                      <span>
                        {monthlySpendChartConfig[String(name)]?.label ??
                          String(name)}
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
              className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-base transition-colors ${visibleSeries[key] ? "border-border bg-muted text-foreground" : "border-transparent text-muted-foreground"}`}
            >
              <span
                aria-hidden="true"
                className="size-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              {config.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SpendByCategoryChart() {
  const chartHeight = Math.max(260, spendByCategory.length * 48);
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
            data={spendByCategory}
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

export function Overview() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <CashFlowSummary />
      <MonthlySpendChart />
      <SpendByCategoryChart />
      <LatestJobRun />
    </div>
  );
}
