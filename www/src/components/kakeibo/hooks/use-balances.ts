import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@site/src/components/uchi/hooks";
import { useApi } from "./use-api";
import { queryKeys } from "./query-keys";
import type { BalanceFilter } from "../api";
import { getKakeiboMockError, getKakeiboMockErrorName } from "./mock-error";

export function useBalances(filter: BalanceFilter) {
  const api = useApi();
  const { session } = useAuth();
  const mockErrorName = getKakeiboMockErrorName("balances");
  return useQuery({
    queryKey: [...queryKeys.balances(filter), mockErrorName],
    queryFn: ({ signal }) => {
      const mockError = getKakeiboMockError("balances");
      if (mockError) throw mockError;
      return api!.getBalances(filter, signal);
    },
    enabled: Boolean(session && api),
  });
}
