import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../lib/api/endpoints/employee";

const CUSTOMERS_KEY = ["employee", "customers"];
const ORDERS_KEY = ["employee", "orders"];
const TICKETS_KEY = ["employee", "tickets"];

export function useEmployeeCustomers(query: api.EmployeeCustomerListQuery = {}) {
  return useQuery({ queryKey: [...CUSTOMERS_KEY, query], queryFn: () => api.listCustomers(query) });
}

export function useEmployeeCustomer(id: number | undefined) {
  return useQuery({ queryKey: [...CUSTOMERS_KEY, id], queryFn: () => api.getCustomer(id as number), enabled: !!id });
}

export function useEmployeeOrders(query: api.EmployeeOrderListQuery = {}) {
  return useQuery({ queryKey: [...ORDERS_KEY, query], queryFn: () => api.listOrders(query) });
}

export function useEmployeeOrder(id: number | undefined) {
  return useQuery({ queryKey: [...ORDERS_KEY, id], queryFn: () => api.getOrder(id as number), enabled: !!id });
}

export function useAddOrderNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note, isInternal }: { id: number; note: string; isInternal?: boolean }) => api.addOrderNote(id, note, isInternal),
    onSuccess: (_data, { id }) => queryClient.invalidateQueries({ queryKey: [...ORDERS_KEY, id] }),
  });
}

export function useEmployeeCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => api.cancelOrder(id, reason),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: [...ORDERS_KEY, id] });
    },
  });
}

export function useEmployeeReturnOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Parameters<typeof api.returnOrder>[1] }) => api.returnOrder(id, input),
    onSuccess: (_data, { id }) => queryClient.invalidateQueries({ queryKey: [...ORDERS_KEY, id] }),
  });
}

export function useTickets(query: api.TicketListQuery = {}) {
  return useQuery({ queryKey: [...TICKETS_KEY, query], queryFn: () => api.listTickets(query) });
}

export function useTicket(id: number | undefined) {
  return useQuery({ queryKey: [...TICKETS_KEY, id], queryFn: () => api.getTicket(id as number), enabled: !!id });
}

export function useAddTicketNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note, isInternal }: { id: number; note: string; isInternal?: boolean }) => api.addTicketNote(id, note, isInternal),
    onSuccess: (_data, { id }) => queryClient.invalidateQueries({ queryKey: [...TICKETS_KEY, id] }),
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, assignToSelf }: { id: number; status: Parameters<typeof api.updateTicketStatus>[1]; assignToSelf?: boolean }) => api.updateTicketStatus(id, status, assignToSelf),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: TICKETS_KEY });
      queryClient.invalidateQueries({ queryKey: [...TICKETS_KEY, id] });
    },
  });
}
