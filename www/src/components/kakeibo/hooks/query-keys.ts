import type { BalanceFilter, MonthRange, TransactionFilter } from "../api";

export const queryKeys = {
  specs: ["kakeibo", "specs"] as const,
  dashboard: (range: MonthRange, accountId?: number) =>
    ["kakeibo", "dashboard", range, accountId] as const,
  transactions: (
    filter: TransactionFilter,
  ) => ["kakeibo", "transactions", filter] as const,
  balances: (filter: BalanceFilter) => ["kakeibo", "balances", filter] as const,
  categories: ["kakeibo", "categories"] as const,
  rules: ["kakeibo", "rules"] as const,
};
