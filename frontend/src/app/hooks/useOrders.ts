import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ordersApi from "../lib/api/endpoints/orders";
import * as checkoutApi from "../lib/api/endpoints/checkout";
import { useAuth } from "../context/AuthContext";

const ORDERS_KEY = ["orders"];
const orderKey = (id: number) => ["orders", id];

export function useOrders() {
  const { status } = useAuth();
  return useQuery({
    queryKey: ORDERS_KEY,
    queryFn: ordersApi.listOrders,
    enabled: status === "authenticated",
  });
}

const LIVE_TRACKING_STATUSES = ["SHIPPED", "OUT_FOR_DELIVERY"];

export function useOrder(id: number | undefined) {
  const { status } = useAuth();
  return useQuery({
    queryKey: orderKey(id ?? -1),
    queryFn: () => ordersApi.getOrder(id as number),
    enabled: status === "authenticated" && !!id,
    // While a shipment is actually moving, poll so the tracking status/timeline
    // updates without the customer having to manually refresh the page.
    refetchInterval: (query) => (query.state.data && LIVE_TRACKING_STATUSES.includes(query.state.data.status) ? 60_000 : false),
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkoutApi.placeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useCancelOrder(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => ordersApi.cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: orderKey(id) });
    },
  });
}

export function useReturnOrder(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { orderItemId?: number; reason: string; requestedQty: number }) => ordersApi.returnOrder(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: orderKey(id) });
    },
  });
}

export function useReorder(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ordersApi.reorder(id),
    onSuccess: (result) => {
      queryClient.setQueryData(["cart"], result.cart);
    },
  });
}

export async function downloadInvoice(id: number, orderNumber: string): Promise<void> {
  const blob = await ordersApi.fetchInvoice(id);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${orderNumber}-invoice.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
