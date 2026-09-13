import { useQuery } from "@tanstack/react-query";
import type {
  TransactionFilter,
} from "../api";
import { useAuth } from "@site/src/components/uchi/hooks";
import { useApi } from "./use-api";
import {
  getKakeiboMockError,
  getKakeiboMockErrorName,
} from "./mock-error";
import { queryKeys } from "./query-keys";

export function useTransactions(filter: TransactionFilter) {
  const api = useApi();
  const { session } = useAuth();
  const mockErrorName = getKakeiboMockErrorName(
    "transactions",
    filter.categoryIds?.length ? "transactions-category" : undefined,
    filter.excludeCategoryIds?.length ? "transactions-exclude-category" : undefined,
    filter.includeUncategorized || filter.excludeUncategorized
      ? "transactions-uncategorized"
      : undefined,
    filter.types?.length ? "transactions-type" : undefined,
    filter.accountId === undefined ? undefined : "transactions-account",
  );

  return useQuery({
    queryKey: [...queryKeys.transactions(filter), mockErrorName],
    queryFn: ({ signal }) => {
      const mockError = getKakeiboMockError(
        "transactions",
        filter.categoryIds?.length ? "transactions-category" : undefined,
        filter.excludeCategoryIds?.length ? "transactions-exclude-category" : undefined,
        filter.includeUncategorized || filter.excludeUncategorized
          ? "transactions-uncategorized"
          : undefined,
        filter.types?.length ? "transactions-type" : undefined,
        filter.accountId === undefined ? undefined : "transactions-account",
      );
      if (mockError) throw mockError;
      return api!.getTransactions(filter, signal);
    },
    enabled: Boolean(session && api && filter.from && filter.to),
  });
}
