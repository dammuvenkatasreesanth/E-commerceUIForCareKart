import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../../lib/api/endpoints/admin/orders";

const ORDERS_KEY = ["admin", "orders"];

export function useAdminOrders(query: api.AdminOrderListQuery = {}) {
  return useQuery({ queryKey: [...ORDERS_KEY, query], queryFn: () => api.listAdminOrders(query) });
}

export function useAdminOrder(id: number | undefined) {
  return useQuery({ queryKey: [...ORDERS_KEY, id], queryFn: () => api.getAdminOrder(id as number), enabled: !!id });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Parameters<typeof api.updateOrderStatus>[1] }) => api.updateOrderStatus(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}

export function useInitiateRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Parameters<typeof api.initiateRefund>[1] }) => api.initiateRefund(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}

export function useRefreshShipmentTracking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.refreshShipmentTracking(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}
