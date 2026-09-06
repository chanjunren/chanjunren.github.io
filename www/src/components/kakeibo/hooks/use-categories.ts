import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@site/src/components/ushi/hooks";
import { useApi } from "./use-api";
import { queryKeys } from "./query-keys";

export function useCategories() {
  const api = useApi();
  const { session } = useAuth();

  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: ({ signal }) => api!.getCategories(signal),
    enabled: Boolean(session && api),
  });
}

export function useCreateCategory() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => api!.createCategory(name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      void queryClient.invalidateQueries({ queryKey: queryKeys.specs });
    },
  });
}
