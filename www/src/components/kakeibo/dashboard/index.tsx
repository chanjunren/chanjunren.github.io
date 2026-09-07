import { MonoLabel } from "@site/src/components/ui/mono-label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@site/src/components/ui/tabs";
import { useState } from "react";
import { type MonthRange } from "../api";
import { DateRangePicker } from "./date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@site/src/components/ui/select";
import { useSpecs } from "../hooks";
import { ErrorBoundary } from "@site/src/components/ui/error-boundary";
import { Categories } from "./categories";
import { Overview } from "./overview";
import { Transactions } from "./transactions";

export function Dashboard() {
  const [range, setRange] = useState<MonthRange>({
    from: "2026-05",
    to: "2026-08",
  });
  const [accountId, setAccountId] = useState<number>();
  const specs = useSpecs();
  const accounts = specs.data?.accounts ?? [];
  return (
    <div className="text-base text-foreground [&_[data-slot=button]]:text-base">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 p-5 lg:p-10">
          <Tabs defaultValue="overview">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <TabsList variant="line" aria-label="Kakeibo sections">
                <TabsTrigger value="overview">
                  <MonoLabel className="text-inherit">Overview</MonoLabel>
                </TabsTrigger>
                <TabsTrigger value="transactions">
                  <MonoLabel className="text-inherit">Transactions</MonoLabel>
                </TabsTrigger>
                <TabsTrigger value="categories">
                  <MonoLabel className="text-inherit">Categories</MonoLabel>
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Select
                  value={accountId ? String(accountId) : "all"}
                  onValueChange={(value) =>
                    setAccountId(value === "all" ? undefined : Number(value))
                  }
                >
                  <SelectTrigger aria-label="Filter by account">
                    {accountId
                      ? (accounts.find((account) => account.id === accountId)
                          ?.displayName ?? "Account")
                      : "All accounts"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All accounts</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={String(account.id)}>
                        {account.name} · {account.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DateRangePicker value={range} onChange={setRange} />
              </div>
            </div>
            <TabsContent value="overview">
              <Overview range={range} accountId={accountId} />
            </TabsContent>
            <TabsContent value="transactions">
              <ErrorBoundary
                key={`${range.from}-${range.to}-${accountId ?? "all"}`}
              >
                <Transactions range={range} accountId={accountId} />
              </ErrorBoundary>
            </TabsContent>
            <TabsContent value="categories">
              <Categories />
            </TabsContent>
          </Tabs>
        </div>
    </div>
  );
}
