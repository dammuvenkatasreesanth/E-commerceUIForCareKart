import { api, apiFetchBlob } from "../../client";
import type { DashboardKpis, SalesTrendPoint, PendingOrderAlert } from "../../../../types/admin";

export function getDashboardKpis(): Promise<DashboardKpis> {
  return api.get("/admin/reports/dashboard");
}

export function getSalesTrend(days = 30): Promise<SalesTrendPoint[]> {
  return api.get(`/admin/reports/sales-trend?days=${days}`);
}

export function getPendingOrderAlerts(): Promise<PendingOrderAlert[]> {
  return api.get("/admin/reports/alerts/pending-orders");
}

export function exportSalesCsv(): Promise<Blob> {
  return apiFetchBlob("/admin/reports/export/sales.csv");
}

export function exportCustomersCsv(): Promise<Blob> {
  return apiFetchBlob("/admin/reports/export/customers.csv");
}

export function exportCouponsCsv(): Promise<Blob> {
  return apiFetchBlob("/admin/reports/export/coupons.csv");
}
