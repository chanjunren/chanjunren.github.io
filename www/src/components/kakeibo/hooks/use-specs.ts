import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@site/src/components/uchi/hooks";
import { useApi } from "./use-api";
import {
  getKakeiboMockError,
  getKakeiboMockErrorName,
} from "./mock-error";
import { queryKeys } from "./query-keys";

export function useSpecs() {
  const api = useApi();
  const { session } = useAuth();
  const mockErrorName = getKakeiboMockErrorName("specs");

  return useQuery({
    queryKey: [...queryKeys.specs, mockErrorName],
    queryFn: ({ signal }) => {
      const mockError = getKakeiboMockError("specs");
      if (mockError) throw mockError;
      return api!.getSpecs(signal);
    },
    enabled: Boolean(session && api),
  });
}
