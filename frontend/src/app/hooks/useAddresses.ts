import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as addressesApi from "../lib/api/endpoints/addresses";
import type { AddressInput } from "../types/address";
import { useAuth } from "../context/AuthContext";

const ADDRESSES_KEY = ["addresses"];

export function useAddresses() {
  const { status } = useAuth();
  return useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: addressesApi.listAddresses,
    enabled: status === "authenticated",
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddressInput) => addressesApi.createAddress(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<AddressInput> }) => addressesApi.updateAddress(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => addressesApi.deleteAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => addressesApi.setDefaultAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}
