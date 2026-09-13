import { ErrorFallback } from "@site/src/components/ui/error-fallback";
import { LoadingFallback } from "@site/src/components/ui/loading-fallback";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@site/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@site/src/components/ui/table";
import { cn } from "@site/src/lib/utils";
import {
  useState,
} from "react";
import {
  type TransactionFilter,
  type TransactionOrder,
  type TransactionSort,
} from "../api";
import {
  useSpecs,
  useTransactions,
} from "../hooks";

function LoadingCard() {
  return <LoadingFallback />;
}
function formatDate(value: string | null | undefined) {
  const date = new Date(
    value && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00`
      : (value ?? ""),
  );
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function getAccountLabel(
  accounts: Array<{ id: number; name: string; displayName: string }>,
  accountId: number,
) {
  const account = accounts.find((item) => item.id === accountId);
  return account ? account.name.slice(0, 3) : `Account ${accountId}`;
}

function getAccountTitle(
  accounts: Array<{ id: number; name: string; displayName: string }>,
  accountId: number,
) {
  const account = accounts.find((item) => item.id === accountId);
  return account ? `${account.name} · ${account.displayName}` : undefined;
}

function DescriptionCell({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const preview = description.length > 44
    ? `${description.slice(0, 44)}…`
    : description;

  if (preview === description) {
    return <span className="font-medium">{description}</span>;
  }

  return (
    <button
      type="button"
      className={`block w-full cursor-pointer text-left font-medium hover:text-foreground ${expanded ? "whitespace-normal break-words" : "truncate"}`}
      aria-expanded={expanded}
      onClick={() => setExpanded((current) => !current)}
    >
      {expanded ? description : preview}
    </button>
  );
}

export function Transactions({
  filters,
}: { filters: TransactionFilter }) {
  const [amountOrder, setAmountOrder] = useState<TransactionOrder>();
  const specs = useSpecs();
  const transactions = useTransactions(
    {
      ...filters,
      sort: amountOrder ? ("amount" as TransactionSort) : undefined,
      order: amountOrder,
    },
  );

  function toggleAmountOrder() {
    setAmountOrder((current) => {
      if (!current) return "desc";
      if (current === "desc") return "asc";
      return undefined;
    });
  }
  const categories = specs.data ? Object.values(specs.data.categories) : [];
  if (specs.isPending || transactions.isPending) return <LoadingCard />;
  if (specs.isError)
    return (
      <ErrorFallback
        onRetry={() => void specs.refetch()}
      />
    );
  if (transactions.isError)
    return (
      <ErrorFallback
        onRetry={() => void transactions.refetch()}
      />
    );
  const categoryName = (categoryId: number | null) =>
    categoryId === null
      ? "Uncategorized"
      : (specs.data?.categories[String(categoryId)]?.name ??
        `Category ${categoryId}`);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>
          <span className="font-mono text-lg font-normal">Transactions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table
          className="w-full"
        >
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1"
                  aria-label={
                    amountOrder === "desc"
                      ? "Sort amount ascending"
                      : "Sort amount descending"
                  }
                  aria-sort={
                    amountOrder === "asc"
                      ? "ascending"
                      : amountOrder === "desc"
                        ? "descending"
                        : "none"
                  }
                  onClick={toggleAmountOrder}
                >
                  Amount
                  {amountOrder === "asc" ? (
                    <ArrowUp className="size-3.5" aria-hidden="true" />
                  ) : amountOrder === "desc" ? (
                    <ArrowDown className="size-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowUpDown className="size-3.5" aria-hidden="true" />
                  )}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(transactions.data ?? []).map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <span className="text-muted-foreground">
                    {formatDate(transaction.transactionDate)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    <span
                      title={getAccountTitle(
                        specs.data?.accounts ?? [],
                        transaction.accountId,
                      )}
                    >
                      {getAccountLabel(
                        specs.data?.accounts ?? [],
                        transaction.accountId,
                      )}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="max-w-[280px] overflow-hidden">
                  <DescriptionCell description={transaction.description} />
                </TableCell>
                <TableCell>
                  <span>{categoryName(transaction.categoryId)}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "font-mono text-sm font-medium uppercase",
                      transaction.type === "credit"
                        ? "text-chart-2"
                        : "text-chart-1",
                    )}
                  >
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "font-mono font-medium",
                      transaction.type === "credit"
                        ? "text-chart-2"
                        : "text-foreground",
                    )}
                  >
                    {transaction.type === "credit" ? "+" : "−"}$
                    {transaction.amount}
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
