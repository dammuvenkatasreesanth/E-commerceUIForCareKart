import { api } from "../client";
import type { Order, PaymentMethod } from "../../../types/order";

export interface PlaceOrderInput {
  addressId: number;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export function placeOrder(input: PlaceOrderInput): Promise<Order> {
  return api.post("/checkout/orders", input);
}
