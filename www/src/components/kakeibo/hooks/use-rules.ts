import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@site/src/components/uchi/hooks";
import { useApi } from "./use-api";
import {
  getKakeiboMockError,
  getKakeiboMockErrorName,
} from "./mock-error";
import { queryKeys } from "./query-keys";

export function useRules() {
  const api = useApi();
  const { session } = useAuth();
  const mockErrorName = getKakeiboMockErrorName("rules");

  return useQuery({
    queryKey: [...queryKeys.rules, mockErrorName],
    queryFn: ({ signal }) => {
      const mockError = getKakeiboMockError("rules");
      if (mockError) throw mockError;
      return api!.getCategoryRules(signal);
    },
    enabled: Boolean(session && api),
  });
}

export function useCreateRule() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      keyword,
    }: {
      categoryId: number;
      keyword: string;
    }) => api!.createCategoryRule(categoryId, keyword),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rules });
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      void queryClient.invalidateQueries({ queryKey: queryKeys.specs });
    },
  });
}
