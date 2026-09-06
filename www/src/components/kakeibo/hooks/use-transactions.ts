import { useQuery } from "@tanstack/react-query";
import type {
  MonthRange,
  TransactionOrder,
  TransactionSort,
} from "../api";
import { useAuth } from "@site/src/components/ushi/hooks";
import { useApi } from "./use-api";
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

  return useQuery({
    queryKey: queryKeys.transactions(
      range,
      categoryId,
      accountId,
      sort,
      order,
    ),
    queryFn: ({ signal }) =>
      api!.getTransactions(range, categoryId, accountId, sort, order, signal),
    enabled: Boolean(session && api && range.from && range.to),
  });
}
