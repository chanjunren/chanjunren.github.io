import { Card, CardContent, CardHeader, CardTitle } from "@site/src/components/ui/card";
import { ErrorFallback } from "@site/src/components/ui/error-fallback";
import { LoadingFallback } from "@site/src/components/ui/loading-fallback";
import { MonoLabel } from "@site/src/components/ui/mono-label";
import { Badge } from "@site/src/components/ui/badge";
import { cn } from "@site/src/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@site/src/components/ui/table";
import type { Account } from "../api";
import type { KakeiboFilters } from "./filters";
import { useBalances, useSpecs } from "../hooks";

function formatAmount(value: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;
  return `${amount < 0 ? "−" : ""}$${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatChange(opening: string, closing: string) {
  const change = Number(closing) - Number(opening);
  if (!Number.isFinite(change)) return "—";
  const sign = change > 0 ? "+" : "";
  return `${sign}${formatAmount(change.toFixed(2))}`;
}

export function Balances({ filters }: { filters: KakeiboFilters }) {
  const balances = useBalances({ ...filters, accountIds: filters.accountId ? [filters.accountId] : undefined });
  const specs = useSpecs();
  if (balances.isPending || specs.isPending) return <LoadingFallback />;
  if (balances.isError) return <ErrorFallback onRetry={() => void balances.refetch()} />;
  if (specs.isError) return <ErrorFallback onRetry={() => void specs.refetch()} />;

  const accounts = specs.data?.accounts ?? [];
  const accountName = (id: number) => {
    const account = accounts.find((item: Account) => item.id === id);
    return account ? `${account.name} · ${account.displayName}` : `Account ${id}`;
  };
  const formatMonth = (value: string) =>
    new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(
      new Date(`${value}T00:00:00`),
    );
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle><MonoLabel>Balances</MonoLabel></CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Period</TableHead><TableHead>Account</TableHead><TableHead>Opening</TableHead><TableHead>Closing</TableHead><TableHead>Net change</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {(balances.data ?? []).length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No reconciled balances in this range.</TableCell></TableRow>
            ) : (balances.data ?? []).map((snapshot) => (
              <TableRow key={`${snapshot.accountId}-${snapshot.periodStart}-${snapshot.sourceFileId}`}>
                <TableCell>{formatMonth(snapshot.periodStart)}</TableCell>
                <TableCell>{accountName(snapshot.accountId)}</TableCell>
                <TableCell className="font-mono font-medium">{formatAmount(snapshot.openingBalance)}</TableCell>
                <TableCell className="font-mono font-medium">{formatAmount(snapshot.closingBalance)}</TableCell>
                <TableCell className={cn("font-mono font-medium", Number(snapshot.closingBalance) >= Number(snapshot.openingBalance) ? "text-chart-2" : "text-chart-1")}>{formatChange(snapshot.openingBalance, snapshot.closingBalance)}</TableCell>
                <TableCell><Badge variant="outline" className="border-chart-2/30 bg-chart-2/10 text-chart-2">{snapshot.reconciliationStatus}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
