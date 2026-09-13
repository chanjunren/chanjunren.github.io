import { useQuery } from "@tanstack/react-query";
import type { MonthRange } from "../api";
import { useAuth } from "@site/src/components/uchi/hooks";
import { useApi } from "./use-api";
import {
  getKakeiboMockError,
  getKakeiboMockErrorName,
} from "./mock-error";
import { queryKeys } from "./query-keys";

export function useDashboard(range: MonthRange, accountId?: number) {
  const api = useApi();
  const { session } = useAuth();
  const mockErrorName = getKakeiboMockErrorName("dashboard");

  return useQuery({
    queryKey: [...queryKeys.dashboard(range, accountId), mockErrorName],
    queryFn: ({ signal }) => {
      const mockError = getKakeiboMockError("dashboard");
      if (mockError) throw mockError;
      return api!.getDashboard(range, accountId, signal);
    },
    enabled: Boolean(session && api && range.from && range.to),
  });
}
