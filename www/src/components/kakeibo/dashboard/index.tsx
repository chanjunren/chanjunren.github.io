import { MonoLabel } from "@site/src/components/ui/mono-label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@site/src/components/ui/tabs";
import { useSpecs } from "../hooks";
import { ErrorBoundary } from "@site/src/components/ui/error-boundary";
import { ErrorFallback } from "@site/src/components/ui/error-fallback";
import { Categories } from "./categories";
import { Overview } from "./overview";
import { Transactions } from "./transactions";
import { Balances } from "./balances";
import { FilterButton, useKakeiboFilters } from "./filters";

export function Dashboard() {
  const [filters, setFilters] = useKakeiboFilters();
  const specs = useSpecs();
  if (specs.isError) {
    return <ErrorFallback />;
  }
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
                <TabsTrigger value="balances">
                  <MonoLabel className="text-inherit">Balances</MonoLabel>
                </TabsTrigger>
                <TabsTrigger value="categories">
                  <MonoLabel className="text-inherit">Categories</MonoLabel>
                </TabsTrigger>
              </TabsList>
              <FilterButton filters={filters} accounts={accounts} categories={Object.values(specs.data?.categories ?? {})} onChange={setFilters} />
            </div>
            <TabsContent value="overview">
              <Overview filters={filters} />
            </TabsContent>
            <TabsContent value="transactions">
              <ErrorBoundary
                key={JSON.stringify(filters)}
              >
                <Transactions filters={filters} />
              </ErrorBoundary>
            </TabsContent>
            <TabsContent value="balances">
              <Balances filters={filters} />
            </TabsContent>
            <TabsContent value="categories">
              <Categories />
            </TabsContent>
          </Tabs>
        </div>
    </div>
  );
}
