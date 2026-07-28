import { api, buildQuery } from "../../client";
import type { AdminCustomerListItem, AdminCustomerDetail, Paginated, StaffStatus } from "../../../../types/admin";
import type { AccountType, GstStatus } from "../../../../types/user";

export interface AdminCustomerListQuery {
  q?: string;
  accountType?: AccountType;
  gstStatus?: GstStatus;
  page?: number;
  limit?: number;
}

export function listCustomers(query: AdminCustomerListQuery = {}): Promise<Paginated<AdminCustomerListItem>> {
  return api.get(`/admin/customers${buildQuery(query as Record<string, string | number | boolean | undefined | null>)}`);
}

export function getCustomer(id: number): Promise<AdminCustomerDetail> {
  return api.get(`/admin/customers/${id}`);
}

export function decideGstApproval(id: number, decision: "APPROVED" | "REJECTED", note?: string): Promise<AdminCustomerListItem> {
  return api.patch(`/admin/customers/${id}/gst-approval`, { decision, note });
}

export function setCustomerStatus(id: number, status: StaffStatus, reason?: string): Promise<AdminCustomerListItem> {
  return api.patch(`/admin/customers/${id}/status`, { status, reason });
}
