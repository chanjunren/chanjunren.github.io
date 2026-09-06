import { MonoLabel } from "@site/src/components/ui/mono-label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@site/src/components/ui/tabs";
import { type CSSProperties } from "react";
import { useState } from "react";
import { type MonthRange } from "../api";
import { DateRangePicker } from "./date-range-picker";
import { KakeiboSidebar, SignOutButton, Wordmark } from "../shared";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@site/src/components/ui/select";
import { useSpecs } from "../hooks";
import { ErrorBoundary } from "@site/src/components/ui/error-boundary";
import { Categories } from "./categories";
import { Overview } from "./overview";
import { Transactions } from "./transactions";
import { useAuth } from "@site/src/components/ushi/hooks";

export function Dashboard() {
  const [range, setRange] = useState<MonthRange>({
    from: "2026-05",
    to: "2026-08",
  });
  const [accountId, setAccountId] = useState<number>();
  const { signOut } = useAuth();
  const specs = useSpecs();
  const accounts = specs.data?.accounts ?? [];
  return (
    <main
      className="flex min-h-[calc(100vh-57px)] bg-background text-base text-foreground [&_[data-slot=button]]:text-base"
      style={
        {
          "--background": "var(--menu-background)",
          "--foreground": "var(--menu-foreground)",
          "--card": "var(--menu-background)",
          "--card-foreground": "var(--menu-foreground)",
          "--muted": "var(--menu-muted-background)",
          "--muted-foreground": "var(--menu-subtle)",
          "--accent": "var(--menu-accent)",
          "--accent-foreground": "var(--menu-accent-foreground)",
          "--chart-1": "#b4637a",
          "--chart-2": "#286983",
          "--chart-3": "#56949f",
          "--chart-4": "#907aa9",
        } as CSSProperties
      }
    >
      <KakeiboSidebar onSignOut={signOut} />
      <section className="min-w-0 flex-1">
        <div className="px-5 pt-5 lg:hidden">
          <Wordmark />
        </div>
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
          <div className="lg:hidden">
            <SignOutButton onSignOut={signOut} />
          </div>
        </div>
      </section>
    </main>
  );
}
