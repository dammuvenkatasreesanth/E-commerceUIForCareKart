import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../../lib/api/endpoints/admin/catalog";
import type { AdminProductInput } from "../../types/admin";

const PRODUCTS_KEY = ["admin", "products"];
const CATEGORIES_KEY = ["admin", "categories"];

export function useAdminProducts(query: api.AdminProductListQuery = {}) {
  return useQuery({ queryKey: [...PRODUCTS_KEY, query], queryFn: () => api.listAdminProducts(query) });
}

export function useAdminProduct(id: number | undefined) {
  return useQuery({ queryKey: [...PRODUCTS_KEY, id], queryFn: () => api.getAdminProduct(id as number), enabled: !!id });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminProductInput) => api.createAdminProduct(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<AdminProductInput> }) => api.updateAdminProduct(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useSetPackTiers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tiers }: { id: number; tiers: NonNullable<AdminProductInput["packTiers"]> }) => api.setPackTiers(id, tiers),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useSetBoxSizes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, boxSizes }: { id: number; boxSizes: NonNullable<AdminProductInput["boxSizes"]> }) => api.setBoxSizes(id, boxSizes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useAddProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => api.addProductImage(id, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useRemoveProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, imageId }: { id: number; imageId: number }) => api.removeProductImage(id, imageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useImportProductsCsv() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => api.importProductsCsv(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useUploadProductVideo() {
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => api.uploadProductVideo(id, file),
  });
}

export function useAdminCategories() {
  return useQuery({ queryKey: CATEGORIES_KEY, queryFn: api.listAdminCategories });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Parameters<typeof api.updateCategory>[1] }) => api.updateCategory(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useUploadCategoryImage() {
  return useMutation({
    mutationFn: (file: File) => api.uploadCategoryImage(file),
  });
}
