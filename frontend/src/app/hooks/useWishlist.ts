import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as wishlistApi from "../lib/api/endpoints/wishlist";
import { useAuth } from "../context/AuthContext";

const WISHLIST_KEY = ["wishlist"];

export function useWishlist() {
  const { status } = useAuth();
  return useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: wishlistApi.getWishlist,
    enabled: status === "authenticated",
  });
}

export function useIsWishlisted(productId: number): boolean {
  const { data } = useWishlist();
  return (data ?? []).some((item) => item.productId === productId);
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => wishlistApi.addToWishlist(productId),
    onSuccess: (data) => queryClient.setQueryData(WISHLIST_KEY, data),
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => wishlistApi.removeFromWishlist(productId),
    onSuccess: (data) => queryClient.setQueryData(WISHLIST_KEY, data),
  });
}
