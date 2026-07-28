import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import * as cartApi from "../lib/api/endpoints/cart";
import { useAuth } from "../context/AuthContext";
import {
  getLocalCart,
  subscribeLocalCart,
  addLocalCartItem,
  updateLocalCartItemQuantity,
  removeLocalCartItem,
  clearLocalCart,
  type LocalCartItem,
} from "../lib/localCart";
import type { CartLineItem, CartResponse } from "../types/cart";

const CART_KEY = ["cart"];
const EMPTY_CART: CartResponse = { items: [], subtotal: 0, shipping: 0, total: 0 };

export interface AddToCartInput {
  productId: number;
  slug: string;
  name: string;
  image: string | null;
  sizeLabel: string;
  tierIndex: number;
  quantity?: number;
}

function useLocalCartItems(): LocalCartItem[] {
  return useSyncExternalStore(subscribeLocalCart, getLocalCart, getLocalCart);
}

function quoteKeyFor(items: LocalCartItem[]) {
  return ["cart-quote", items.map((i) => `${i.productId}:${i.sizeLabel}:${i.tierIndex}:${i.quantity}`).join("|")];
}

/**
 * Authenticated users hit the real /cart endpoints; guests are re-priced
 * live via POST /cart/quote against their localStorage cart (see localCart.ts).
 * Both paths converge on the same CartResponse shape so callers never branch.
 */
export function useCart(): Pick<UseQueryResult<CartResponse>, "data" | "isLoading" | "isFetching"> {
  const { status } = useAuth();
  const isAuthed = status === "authenticated";
  const localItems = useLocalCartItems();

  const authedQuery = useQuery({
    queryKey: CART_KEY,
    queryFn: cartApi.getCart,
    enabled: isAuthed,
  });

  const guestQuery = useQuery({
    queryKey: quoteKeyFor(localItems),
    queryFn: () =>
      cartApi.quoteCart(localItems.map(({ productId, sizeLabel, tierIndex, quantity }) => ({ productId, sizeLabel, tierIndex, quantity }))),
    enabled: !isAuthed && localItems.length > 0,
  });

  if (isAuthed) return authedQuery;
  if (localItems.length === 0) return { data: EMPTY_CART, isLoading: false, isFetching: false };
  return guestQuery;
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { status } = useAuth();
  return useMutation({
    mutationFn: async (input: AddToCartInput): Promise<CartResponse | null> => {
      if (status === "authenticated") {
        return cartApi.addCartItem({
          productId: input.productId,
          sizeLabel: input.sizeLabel,
          tierIndex: input.tierIndex,
          quantity: input.quantity ?? 1,
        });
      }
      addLocalCartItem({
        productId: input.productId,
        slug: input.slug,
        name: input.name,
        image: input.image,
        sizeLabel: input.sizeLabel,
        tierIndex: input.tierIndex,
        quantity: input.quantity ?? 1,
      });
      return null;
    },
    onSuccess: (data) => {
      if (data) queryClient.setQueryData(CART_KEY, data);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { status } = useAuth();
  return useMutation({
    mutationFn: async ({ item, quantity }: { item: CartLineItem; quantity: number }): Promise<CartResponse | null> => {
      if (status === "authenticated") {
        return cartApi.updateCartItem(item.id, quantity);
      }
      updateLocalCartItemQuantity({ productId: item.productId, sizeLabel: item.sizeLabel, tierIndex: item.tierIndex }, quantity);
      return null;
    },
    onSuccess: (data) => {
      if (data) queryClient.setQueryData(CART_KEY, data);
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { status } = useAuth();
  return useMutation({
    mutationFn: async (item: CartLineItem): Promise<CartResponse | null> => {
      if (status === "authenticated") {
        return cartApi.removeCartItem(item.id);
      }
      removeLocalCartItem({ productId: item.productId, sizeLabel: item.sizeLabel, tierIndex: item.tierIndex });
      return null;
    },
    onSuccess: (data) => {
      if (data) queryClient.setQueryData(CART_KEY, data);
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const { status } = useAuth();
  return useMutation({
    mutationFn: async () => {
      if (status === "authenticated") {
        await cartApi.clearCart();
      } else {
        clearLocalCart();
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}
