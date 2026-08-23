import { api, apiFetchBlob, buildQuery } from "../../client";
import type { AdminOrder, AdminOrderDetail, Paginated } from "../../../../types/admin";
import type { OrderStatus, PaymentStatus } from "../../../../types/order";

export interface AdminOrderListQuery {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  q?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export function listAdminOrders(query: AdminOrderListQuery = {}): Promise<Paginated<AdminOrder>> {
  return api.get(`/admin/orders${buildQuery(query as Record<string, string | number | boolean | undefined | null>)}`);
}

export function getAdminOrder(id: number): Promise<AdminOrderDetail> {
  return api.get(`/admin/orders/${id}`);
}

export function updateOrderStatus(
  id: number,
  input: { status: OrderStatus; note?: string; trackingId?: string; carrier?: string },
): Promise<AdminOrder> {
  return api.patch(`/admin/orders/${id}/status`, input);
}

export function initiateRefund(id: number, input: { amount: number; reason: string }): Promise<{ id: number; amount: string; status: string }> {
  return api.post(`/admin/orders/${id}/refund`, input);
}

export function refreshShipmentTracking(id: number): Promise<AdminOrder> {
  return api.post(`/admin/orders/${id}/refresh-tracking`);
}

export function schedulePickup(): Promise<{ pickupId: string | null }> {
  return api.post(`/admin/orders/schedule-pickup`);
}

export function exportOrdersCsv(query: AdminOrderListQuery = {}): Promise<Blob> {
  return apiFetchBlob(`/admin/orders/export${buildQuery(query as Record<string, string | number | boolean | undefined | null>)}`);
}
