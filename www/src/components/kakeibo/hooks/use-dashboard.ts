import { useQuery } from "@tanstack/react-query";
import type { MonthRange } from "../api";
import { useAuth } from "@site/src/components/ushi/hooks";
import { useApi } from "./use-api";
import { queryKeys } from "./query-keys";

export function useDashboard(range: MonthRange, accountId?: number) {
  const api = useApi();
  const { session } = useAuth();

  return useQuery({
    queryKey: queryKeys.dashboard(range, accountId),
    queryFn: ({ signal }) => api!.getDashboard(range, accountId, signal),
    enabled: Boolean(session && api && range.from && range.to),
  });
}
