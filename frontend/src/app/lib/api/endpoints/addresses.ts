import { api } from "../client";
import type { Address, AddressInput } from "../../../types/address";

export function listAddresses(): Promise<Address[]> {
  return api.get("/users/me/addresses");
}

export function createAddress(input: AddressInput): Promise<Address> {
  return api.post("/users/me/addresses", input);
}

export function updateAddress(id: number, input: Partial<AddressInput>): Promise<Address> {
  return api.patch(`/users/me/addresses/${id}`, input);
}

export function deleteAddress(id: number): Promise<void> {
  return api.delete(`/users/me/addresses/${id}`);
}

export function setDefaultAddress(id: number): Promise<Address> {
  return api.post(`/users/me/addresses/${id}/default`);
}
