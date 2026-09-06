import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@site/src/components/ushi/hooks";
import { useApi } from "./use-api";
import { queryKeys } from "./query-keys";

export function useRules() {
  const api = useApi();
  const { session } = useAuth();

  return useQuery({
    queryKey: queryKeys.rules,
    queryFn: ({ signal }) => api!.getCategoryRules(signal),
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
