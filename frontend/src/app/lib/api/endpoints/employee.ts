import { api, buildQuery } from "../client";
import type { AdminOrder, AdminOrderDetail, AdminOrderNote, AdminCustomerListItem, AdminCustomerDetail, Paginated } from "../../../types/admin";
import type { SupportTicketListItem, SupportTicketDetail, TicketStatus, TicketNote } from "../../../types/support";
import type { Order, OrderStatus, PaymentStatus, ReturnRequest } from "../../../types/order";

// ─── Customers (read-only) ────────────────────────────────────────────────
export interface EmployeeCustomerListQuery {
  q?: string;
  accountType?: "RETAIL" | "BUSINESS";
  gstStatus?: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
  page?: number;
  limit?: number;
}

export function listCustomers(query: EmployeeCustomerListQuery = {}): Promise<Paginated<AdminCustomerListItem>> {
  return api.get(`/employee/customers${buildQuery(query as Record<string, string | number | boolean | undefined | null>)}`);
}

export function getCustomer(id: number): Promise<AdminCustomerDetail> {
  return api.get(`/employee/customers/${id}`);
}

// ─── Orders (read + narrow write — no pricing/catalog access) ────────────
export interface EmployeeOrderListQuery {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  q?: string;
  page?: number;
  limit?: number;
}

export function listOrders(query: EmployeeOrderListQuery = {}): Promise<Paginated<AdminOrder>> {
  return api.get(`/employee/orders${buildQuery(query as Record<string, string | number | boolean | undefined | null>)}`);
}

export function getOrder(id: number): Promise<AdminOrderDetail> {
  return api.get(`/employee/orders/${id}`);
}

export function addOrderNote(id: number, note: string, isInternal = true): Promise<AdminOrderNote> {
  return api.post(`/employee/orders/${id}/notes`, { note, isInternal });
}

// cancelOrder/returnOrder reuse the same orders.service.ts functions as the
// customer-facing endpoints (server/src/modules/orders/orders.service.ts) —
// neither includes the `user` relation, so these return the plain Order/
// ReturnRequest shapes, not the Admin-prefixed ones with a nested user.
export function cancelOrder(id: number, reason: string): Promise<Order> {
  return api.patch(`/employee/orders/${id}/cancel`, { reason });
}

export function returnOrder(id: number, input: { orderItemId?: number; reason: string; requestedQty: number }): Promise<ReturnRequest> {
  return api.post(`/employee/orders/${id}/return`, input);
}

// ─── Support tickets ───────────────────────────────────────────────────────
export interface TicketListQuery {
  status?: TicketStatus;
  page?: number;
  limit?: number;
}

export function listTickets(query: TicketListQuery = {}): Promise<Paginated<SupportTicketListItem>> {
  return api.get(`/employee/tickets${buildQuery(query as Record<string, string | number | boolean | undefined | null>)}`);
}

export function getTicket(id: number): Promise<SupportTicketDetail> {
  return api.get(`/employee/tickets/${id}`);
}

export function addTicketNote(id: number, note: string, isInternal = false): Promise<TicketNote> {
  return api.post(`/employee/tickets/${id}/notes`, { note, isInternal });
}

// Backend does a bare prisma.supportTicket.update() with no include, so the
// response has scalar fields only — no nested user/assignedTo like the list/get endpoints.
export function updateTicketStatus(id: number, status: TicketStatus, assignToSelf = false): Promise<Omit<SupportTicketListItem, "user" | "assignedTo">> {
  return api.patch(`/employee/tickets/${id}/status`, { status, assignToSelf });
}
