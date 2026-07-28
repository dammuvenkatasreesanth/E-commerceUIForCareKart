import { useQuery } from "@tanstack/react-query";
import * as api from "../../lib/api/endpoints/admin/reports";

export function useDashboardKpis() {
  return useQuery({ queryKey: ["admin", "dashboard"], queryFn: api.getDashboardKpis });
}

export function useSalesTrend(days = 30) {
  return useQuery({ queryKey: ["admin", "sales-trend", days], queryFn: () => api.getSalesTrend(days) });
}

export function usePendingOrderAlerts() {
  return useQuery({ queryKey: ["admin", "alerts", "pending-orders"], queryFn: api.getPendingOrderAlerts });
}
