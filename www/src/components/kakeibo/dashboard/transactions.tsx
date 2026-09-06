import { ErrorPage } from "@site/src/components/ui/error-page";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@site/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@site/src/components/ui/select";
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
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type MonthRange,
  type TransactionOrder,
  type TransactionSort,
} from "../api";
import {
  useSpecs,
  useTransactions,
} from "../hooks";

function LoadingCard() {
  return (
    <Card className="mt-4">
      <CardContent className="py-8 text-base text-muted-foreground">
        Loading transactions…
      </CardContent>
    </Card>
  );
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

type ColumnKey =
  | "date"
  | "account"
  | "description"
  | "type"
  | "category"
  | "amount";

const defaultColumnWidths: Record<ColumnKey, number> = {
  date: 88,
  account: 112,
  description: 240,
  type: 88,
  category: 150,
  amount: 110,
};

function ResizeHandle({
  column,
  onResizeStart,
}: {
  column: ColumnKey;
  onResizeStart: (column: ColumnKey, event: ReactPointerEvent) => void;
}) {
  return (
    <span
      role="separator"
      aria-label={`Resize ${column} column`}
      className="absolute inset-y-0 right-0 z-10 w-2 cursor-col-resize touch-none transition-colors hover:bg-border"
      onPointerDown={(event) => onResizeStart(column, event)}
    />
  );
}

export function Transactions({
  range,
  accountId,
}: {
  range: MonthRange;
  accountId?: number;
}) {
  const [categoryId, setCategoryId] = useState<number>();
  const [amountOrder, setAmountOrder] = useState<TransactionOrder>();
  const [columnWidths, setColumnWidths] =
    useState<Record<ColumnKey, number>>(defaultColumnWidths);
  const resizeRef = useRef<{
    column: ColumnKey;
    startX: number;
    startWidth: number;
  } | null>(null);
  const specs = useSpecs();
  const transactions = useTransactions(
    range,
    categoryId,
    accountId,
    amountOrder ? ("amount" as TransactionSort) : undefined,
    amountOrder,
  );

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const resize = resizeRef.current;
      if (!resize) return;
      const width = Math.max(
        72,
        resize.startWidth + event.clientX - resize.startX,
      );
      setColumnWidths((current) => ({ ...current, [resize.column]: width }));
    }

    function handlePointerUp() {
      resizeRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  function handleResizeStart(column: ColumnKey, event: ReactPointerEvent) {
    event.preventDefault();
    resizeRef.current = {
      column,
      startX: event.clientX,
      startWidth: columnWidths[column],
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  function toggleAmountOrder() {
    setAmountOrder((current) => {
      if (!current) return "desc";
      if (current === "desc") return "asc";
      return undefined;
    });
  }
  const categories = specs.data ? Object.values(specs.data.categories) : [];
  const tableWidth = Object.values(columnWidths).reduce(
    (total, width) => total + width,
    0,
  );
  if (specs.isPending || transactions.isPending) return <LoadingCard />;
  if (specs.isError)
    return (
      <ErrorPage
        title="Unable to load transaction filters"
        description={specs.error.message}
        onRetry={() => void specs.refetch()}
      />
    );
  if (transactions.isError)
    return (
      <ErrorPage
        title="Unable to load transactions"
        description={transactions.error.message}
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
        <CardAction>
          <Select
            value={categoryId ? String(categoryId) : "all"}
            onValueChange={(value) =>
              setCategoryId(value === "all" ? undefined : Number(value))
            }
          >
            <SelectTrigger aria-label="Filter transactions by category">
              {categoryId
                ? (categories.find((category) => category.id === categoryId)
                    ?.name ?? "Category")
                : "All categories"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table
          className="w-full table-fixed"
          style={{ minWidth: tableWidth }}
        >
          <colgroup>
            {(Object.keys(defaultColumnWidths) as ColumnKey[]).map((column) => (
              <col key={column} style={{ width: columnWidths[column] }} />
            ))}
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead className="relative">
                Date
                <ResizeHandle
                  column="date"
                  onResizeStart={handleResizeStart}
                />
              </TableHead>
              <TableHead className="relative">
                Account
                <ResizeHandle
                  column="account"
                  onResizeStart={handleResizeStart}
                />
              </TableHead>
              <TableHead className="relative">
                Description
                <ResizeHandle
                  column="description"
                  onResizeStart={handleResizeStart}
                />
              </TableHead>
              <TableHead className="relative">
                Type
                <ResizeHandle
                  column="type"
                  onResizeStart={handleResizeStart}
                />
              </TableHead>
              <TableHead className="relative">
                Category
                <ResizeHandle
                  column="category"
                  onResizeStart={handleResizeStart}
                />
              </TableHead>
              <TableHead className="relative text-right">
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
                <ResizeHandle
                  column="amount"
                  onResizeStart={handleResizeStart}
                />
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
                <TableCell className="max-w-0 overflow-hidden">
                  <DescriptionCell description={transaction.description} />
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
                <TableCell>
                  <span>{categoryName(transaction.categoryId)}</span>
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
