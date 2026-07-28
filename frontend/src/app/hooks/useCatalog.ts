import { useQuery } from "@tanstack/react-query";
import * as catalogApi from "../lib/api/endpoints/catalog";
import type { ProductListQuery } from "../types/catalog";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: catalogApi.listCategories, staleTime: 5 * 60_000 });
}

export function useBanners() {
  return useQuery({ queryKey: ["banners"], queryFn: catalogApi.listBanners, staleTime: 5 * 60_000 });
}

export function useProducts(query: ProductListQuery) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => catalogApi.listProducts(query),
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => catalogApi.getProduct(slug as string),
    enabled: !!slug,
  });
}

export function useAutosuggest(q: string) {
  return useQuery({
    queryKey: ["autosuggest", q],
    queryFn: () => catalogApi.autosuggest(q),
    enabled: q.trim().length >= 1,
    staleTime: 30_000,
  });
}
