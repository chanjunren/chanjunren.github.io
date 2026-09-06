import { MonoLabel } from "@site/src/components/ui/mono-label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@site/src/components/ui/tabs";
import { type CSSProperties } from "react";
import { DateRangePicker } from "../date-range-picker";
import { KakeiboSidebar, Wordmark } from "../shared";
import { Categories } from "./categories";
import { Overview } from "./overview";
import { Transactions } from "./transactions";

export function Dashboard() {
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
      <KakeiboSidebar />
      <section className="min-w-0 flex-1">
        <div className="px-5 pt-5 lg:hidden">
          <Wordmark />
        </div>
        <div className="mx-auto flex max-w-6xl flex-col gap-6 p-5 lg:p-10">
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
              <DateRangePicker />
            </div>
            <TabsContent value="overview">
              <Overview />
            </TabsContent>
            <TabsContent value="transactions">
              <Transactions />
            </TabsContent>
            <TabsContent value="categories">
              <Categories />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
