import type {
  MonthRange,
  TransactionOrder,
  TransactionSort,
} from "../api";

export const queryKeys = {
  specs: ["kakeibo", "specs"] as const,
  dashboard: (range: MonthRange, accountId?: number) =>
    ["kakeibo", "dashboard", range, accountId] as const,
  transactions: (
    range: MonthRange,
    categoryId?: number,
    accountId?: number,
    sort?: TransactionSort,
    order?: TransactionOrder,
  ) => ["kakeibo", "transactions", range, categoryId, accountId, sort, order] as const,
  categories: ["kakeibo", "categories"] as const,
  rules: ["kakeibo", "rules"] as const,
};
