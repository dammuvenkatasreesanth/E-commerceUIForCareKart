import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { setAccessToken } from "../lib/api/tokenStore";
import { getLocalCart, clearLocalCart } from "../lib/localCart";
import { addCartItem } from "../lib/api/endpoints/cart";
import type { AuthUser } from "../types/user";

// Shared by every place a customer can complete authentication (password
// login, OAuth, email verification) — merges any guest-cart items into the
// real server cart before flipping AuthContext to "authenticated", so
// components gated on that status don't mount mid-merge.
export function useAuthenticateAndMergeCart() {
  const { loginCustomer } = useAuth();
  const queryClient = useQueryClient();

  return useCallback(
    async (accessToken: string, user: AuthUser) => {
      setAccessToken(accessToken, "customer");
      const localItems = getLocalCart();
      const skipped: string[] = [];
      for (const item of localItems) {
        try {
          await addCartItem({ productId: item.productId, sizeLabel: item.sizeLabel, tierIndex: item.tierIndex, quantity: item.quantity });
        } catch {
          skipped.push(item.name);
        }
      }
      clearLocalCart();
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (skipped.length > 0) {
        toast.warning(`Some items couldn't be added to your cart: ${skipped.join(", ")}`);
      }
      loginCustomer(accessToken, user);
    },
    [loginCustomer, queryClient],
  );
}
