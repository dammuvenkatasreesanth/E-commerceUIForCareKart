import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../../lib/api/endpoints/admin/shipping";
import type { BoxSizeInput } from "../../types/admin";

const BOX_SIZES_KEY = ["admin", "shipping", "box-sizes"];

export function useBoxSizes() {
  return useQuery({ queryKey: BOX_SIZES_KEY, queryFn: api.listBoxSizes });
}

export function useCreateBoxSize() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BoxSizeInput) => api.createBoxSize(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOX_SIZES_KEY }),
  });
}

export function useUpdateBoxSize() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: BoxSizeInput }) => api.updateBoxSize(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOX_SIZES_KEY }),
  });
}

export function useDeleteBoxSize() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteBoxSize(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOX_SIZES_KEY }),
  });
}
