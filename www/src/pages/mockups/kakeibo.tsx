import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, type CSSProperties, type ReactNode } from "react";
import { type Session } from "@supabase/supabase-js";
import { Dashboard } from "@site/src/components/kakeibo/dashboard";
import { ApiContext } from "@site/src/components/kakeibo/context";
import {
  mockCategoryRulesResponse,
  mockDashboardResponse,
  mockSpecsResponse,
  mockTransactionsResponse,
} from "@site/src/components/kakeibo/data";
import type {
  KakeiboApi,
  SpecsResponse,
  Transaction,
} from "@site/src/components/kakeibo/api";
import {
  AuthContext,
  type AuthContextValue,
} from "@site/src/components/uchi/hooks/context";

const mockApi: KakeiboApi = {
  getSpecs: async () => mockSpecsResponse as SpecsResponse,
  getDashboard: async () => mockDashboardResponse,
  getTransactions: async () => mockTransactionsResponse as Transaction[],
  getBalances: async () => [
    {
      accountId: 1,
      openingBalance: "4820.00",
      closingBalance: "6185.44",
      periodStart: "2026-08-01",
      periodEnd: "2026-08-31",
      sourceFileId: "local:dbs_2608.csv:mock",
      reconciliationStatus: "reconciled",
    },
  ],
  getCategories: async () => Object.values(mockSpecsResponse.categories),
  createCategory: async (name) => ({
    id: 99,
    name,
    priority: 999,
    ruleCount: 0,
  }),
  getCategoryRules: async () => mockCategoryRulesResponse,
  createCategoryRule: async () => undefined,
  deleteCategoryRule: async () => undefined,
  updateTransactionCategories: async () => undefined,
};

function MockProviders({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const auth = useMemo<AuthContextValue>(
    () => ({
      session: {} as Session,
      authLoading: false,
      authError: null,
      signIn: async () => undefined,
      signOut: async () => undefined,
    }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={mockApi}>
        <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
      </ApiContext.Provider>
    </QueryClientProvider>
  );
}

export default function KakeiboMockupPage() {
  return (
    <main
      className="min-h-screen bg-(--menu-background) text-(--menu-foreground)"
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
      <div className="mx-auto max-w-[1440px] px-3 py-8 sm:px-6 lg:px-10">
        <div className="mb-4 px-2">
          <p className="font-mono text-xs uppercase tracking-normal text-muted-foreground">
            mockup / 家計簿
          </p>
        </div>
        <MockProviders>
          <Dashboard />
        </MockProviders>
      </div>
    </main>
  );
}
