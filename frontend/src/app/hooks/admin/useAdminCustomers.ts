import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../../lib/api/endpoints/admin/customers";

const CUSTOMERS_KEY = ["admin", "customers"];

export function useAdminCustomers(query: api.AdminCustomerListQuery = {}) {
  return useQuery({ queryKey: [...CUSTOMERS_KEY, query], queryFn: () => api.listCustomers(query) });
}

export function useAdminCustomer(id: number | undefined) {
  return useQuery({ queryKey: [...CUSTOMERS_KEY, id], queryFn: () => api.getCustomer(id as number), enabled: !!id });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: api.UpdateCustomerInput }) => api.updateCustomer(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });
}

export function useDecideGstApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision, note }: { id: number; decision: "APPROVED" | "REJECTED"; note?: string }) => api.decideGstApproval(id, decision, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });
}

export function useSetCustomerStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: number; status: Parameters<typeof api.setCustomerStatus>[1]; reason?: string }) => api.setCustomerStatus(id, status, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });
}
