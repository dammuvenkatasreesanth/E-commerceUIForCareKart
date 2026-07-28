import { api, apiFetchBlob } from "../client";
import type { Order, ReturnRequest, ReorderResult } from "../../../types/order";

export function listOrders(): Promise<Order[]> {
  return api.get("/orders");
}

export function getOrder(id: number): Promise<Order> {
  return api.get(`/orders/${id}`);
}

export function cancelOrder(id: number, reason: string): Promise<Order> {
  return api.post(`/orders/${id}/cancel`, { reason });
}

export function returnOrder(
  id: number,
  input: { orderItemId?: number; reason: string; requestedQty: number },
): Promise<ReturnRequest> {
  return api.post(`/orders/${id}/return`, input);
}

export function reorder(id: number): Promise<ReorderResult> {
  return api.post(`/orders/${id}/reorder`);
}

export function fetchInvoice(id: number): Promise<Blob> {
  return apiFetchBlob(`/orders/${id}/invoice`);
}
