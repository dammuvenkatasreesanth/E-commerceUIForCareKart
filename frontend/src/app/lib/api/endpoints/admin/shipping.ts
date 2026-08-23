import { api } from "../../client";
import type { BoxSize, BoxSizeInput } from "../../../../types/admin";

export function listBoxSizes(): Promise<BoxSize[]> {
  return api.get("/admin/shipping/box-sizes");
}

export function createBoxSize(input: BoxSizeInput): Promise<BoxSize> {
  return api.post("/admin/shipping/box-sizes", input);
}

export function updateBoxSize(id: number, input: BoxSizeInput): Promise<BoxSize> {
  return api.put(`/admin/shipping/box-sizes/${id}`, input);
}

export function deleteBoxSize(id: number): Promise<void> {
  return api.delete(`/admin/shipping/box-sizes/${id}`);
}
