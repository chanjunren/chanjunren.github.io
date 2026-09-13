import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@site/src/components/uchi/hooks";
import { useApi } from "./use-api";
import {
  getKakeiboMockError,
  getKakeiboMockErrorName,
} from "./mock-error";
import { queryKeys } from "./query-keys";

export function useCategories() {
  const api = useApi();
  const { session } = useAuth();
  const mockErrorName = getKakeiboMockErrorName("categories");

  return useQuery({
    queryKey: [...queryKeys.categories, mockErrorName],
    queryFn: ({ signal }) => {
      const mockError = getKakeiboMockError("categories");
      if (mockError) throw mockError;
      return api!.getCategories(signal);
    },
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
