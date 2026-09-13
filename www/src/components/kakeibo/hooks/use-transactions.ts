import { useQuery } from "@tanstack/react-query";
import type {
  MonthRange,
  TransactionOrder,
  TransactionSort,
} from "../api";
import { useAuth } from "@site/src/components/uchi/hooks";
import { useApi } from "./use-api";
import {
  getKakeiboMockError,
  getKakeiboMockErrorName,
} from "./mock-error";
import { queryKeys } from "./query-keys";

export function useTransactions(
  range: MonthRange,
  categoryId?: number,
  accountId?: number,
  sort?: TransactionSort,
  order?: TransactionOrder,
) {
  const api = useApi();
  const { session } = useAuth();
  const mockErrorName = getKakeiboMockErrorName(
    "transactions",
    categoryId === undefined ? undefined : "transactions-category",
    accountId === undefined ? undefined : "transactions-account",
  );

  return useQuery({
    queryKey: queryKeys.transactions(
      range,
      categoryId,
      accountId,
      sort,
      order,
    ).concat(mockErrorName),
    queryFn: ({ signal }) => {
      const mockError = getKakeiboMockError(
        "transactions",
        categoryId === undefined ? undefined : "transactions-category",
        accountId === undefined ? undefined : "transactions-account",
      );
      if (mockError) throw mockError;
      return api!.getTransactions(
        range,
        categoryId,
        accountId,
        sort,
        order,
        signal,
      );
    },
    enabled: Boolean(session && api && range.from && range.to),
  });
}
