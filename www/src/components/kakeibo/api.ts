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
  categorizationStatuses: Array<"categorized" | "uncategorized">;
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
    getTransactions: (
      range: MonthRange,
      categoryId?: number,
      accountId?: number,
      sort?: TransactionSort,
      order?: TransactionOrder,
      signal?: AbortSignal,
    ) => {
      const params = new URLSearchParams({ from: range.from, to: range.to });
      if (categoryId) params.set("categoryId", String(categoryId));
      if (accountId) params.set("accountId", String(accountId));
      if (sort && order) {
        params.set("sort", sort);
        params.set("order", order);
      }
      return request<unknown>(`/transactions?${params}`, { signal }).then(
        (data) => {
          if (!Array.isArray(data)) {
            throw new Error("The transactions response was not a list.");
          }
          return data as Transaction[];
        },
      );
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
