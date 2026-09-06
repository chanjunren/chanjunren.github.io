import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@site/src/components/ushi/hooks";
import { useApi } from "./use-api";
import { queryKeys } from "./query-keys";

export function useSpecs() {
  const api = useApi();
  const { session } = useAuth();

  return useQuery({
    queryKey: queryKeys.specs,
    queryFn: ({ signal }) => api!.getSpecs(signal),
    enabled: Boolean(session && api),
  });
}
