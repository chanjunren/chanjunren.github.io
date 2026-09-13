import { type SupabaseClient } from "@supabase/supabase-js";

export type KakeiboConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  backiesApiBase: string;
};

export type Category = {
  id: number;
  name: string;
  priority: number;
  ruleCount: number;
};

export type SpecsResponse = {
  availableMonths: Array<{
    month: string;
    transactionCount: number;
    uncategorizedCount: number;
  }>;
  defaultMonth: string | null;
  categories: Record<string, Category>;
  accounts: Array<{
    id: number;
    name: string;
    displayName: string;
    currency: string;
  }>;
  transactionTypes: Array<"debit" | "credit">;
};

export type Account = SpecsResponse["accounts"][number];

export type ProcessedFile = {
  sourceFileId: string;
  fileName: string;
  accountId: number | null;
  parserKey: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  processedAt: string;
  status: string;
};

export type DashboardResponse = {
  from: string;
  to: string;
  totalOut: string;
  totalIn: string;
  net: string;
  uncategorizedCount: number;
  spendByCategory: Array<{ categoryId: number; total: string; count: number }>;
  monthlySpend: Array<{
    month: string;
    totalOut: string;
    totalIn: string;
    net: string;
  }>;
  processedFiles: Array<ProcessedFile>;
};

export type Transaction = {
  id: number;
  accountId: number;
  transactionDate: string;
  description: string;
  amount: string;
  type: "debit" | "credit";
  categoryId: number | null;
  category?: Category | null;
  sourceFileId: string;
  createdAt: string;
};

export type TransactionSort = "amount";
export type TransactionOrder = "asc" | "desc";
export type TransactionType = "debit" | "credit";

export type BalanceFilter = {
  from?: string;
  to?: string;
  accountIds?: number[];
};

export type TransactionFilter = MonthRange & {
  accountId?: number;
  categoryIds?: number[];
  excludeCategoryIds?: number[];
  includeUncategorized?: boolean;
  excludeUncategorized?: boolean;
  types?: TransactionType[];
  sort?: TransactionSort;
  order?: TransactionOrder;
};

export type BalanceSnapshot = {
  accountId: number;
  openingBalance: string;
  closingBalance: string;
  periodStart: string;
  periodEnd: string;
  sourceFileId: string;
  reconciliationStatus: string;
};

export type CategoryRule = {
  id: number;
  categoryId: number;
  keyword: string;
  createdAt: string;
};
export type MonthRange = { from: string; to: string };

export function createKakeiboApi(
  config: KakeiboConfig,
  supabase: SupabaseClient,
) {
  async function request<T>(path: string, options: RequestInit = {}) {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session)
      throw new Error("Your session has expired. Please sign in again.");
    const response = await fetch(
      `${config.backiesApiBase}/api/kakeibo${path}`,
      {
        ...options,
        signal: options.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
          ...options.headers,
        },
      },
    );
    if (!response.ok) {
      let message = `Kakeibo request failed: HTTP ${response.status}`;
      try {
        const body = await response.json();
        if (body?.error) message = body.error;
      } catch {
        /* keep the HTTP message */
      }
      throw new Error(message);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  return {
    getSpecs: (signal?: AbortSignal) =>
      request<SpecsResponse>("/specs", { signal }),
    getDashboard: (
      range: MonthRange,
      accountId?: number,
      signal?: AbortSignal,
    ) => {
      const params = new URLSearchParams({ from: range.from, to: range.to });
      if (accountId) params.set("accountId", String(accountId));
      return request<DashboardResponse>(`/dashboard?${params}`, { signal });
    },
    getTransactions: (filter: TransactionFilter, signal?: AbortSignal) => {
      const params = new URLSearchParams({ from: filter.from, to: filter.to });
      if (filter.accountId) params.set("accountId", String(filter.accountId));
      for (const categoryId of filter.categoryIds ?? [])
        params.append("categoryId", String(categoryId));
      for (const categoryId of filter.excludeCategoryIds ?? [])
        params.append("excludeCategoryId", String(categoryId));
      if (filter.includeUncategorized) params.append("categoryId", "uncategorized");
      if (filter.excludeUncategorized)
        params.append("excludeCategoryId", "uncategorized");
      for (const type of filter.types ?? []) params.append("type", type);
      if (filter.sort && filter.order) {
        params.set("sort", filter.sort);
        params.set("order", filter.order);
      }
      return request<unknown>(`/transactions?${params}`, {
        signal,
      }).then(
        (data) => {
          if (!Array.isArray(data)) {
            throw new Error("The transactions response was not a list.");
          }
          return data as Transaction[];
        },
      );
    },
    getBalances: (filter: BalanceFilter = {}, signal?: AbortSignal) => {
      const params = new URLSearchParams();
      if (filter.from) params.set("from", filter.from);
      if (filter.to) params.set("to", filter.to);
      for (const accountId of filter.accountIds ?? [])
        params.append("accountId", String(accountId));
      const query = params.toString();
      return request<BalanceSnapshot[]>(`/balances${query ? `?${query}` : ""}`, {
        signal,
      });
    },
    getCategories: (signal?: AbortSignal) =>
      request<Category[]>("/categories", { signal }),
    createCategory: (name: string) =>
      request<Category>("/categories", {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    getCategoryRules: (signal?: AbortSignal) =>
      request<CategoryRule[]>("/category-rules", { signal }),
    createCategoryRule: (categoryId: number, keyword: string) =>
      request("/category-rules", {
        method: "POST",
        body: JSON.stringify({ rules: [{ categoryId, keyword }] }),
      }),
    deleteCategoryRule: (id: number) =>
      request(`/category-rules/${id}`, { method: "DELETE" }),
    updateTransactionCategories: (
      updates: Array<{ transactionId: number; categoryId: number | null }>,
    ) =>
      request("/transactions/categories", {
        method: "PATCH",
        body: JSON.stringify({ updates }),
      }),
  };
}

export type KakeiboApi = ReturnType<typeof createKakeiboApi>;
