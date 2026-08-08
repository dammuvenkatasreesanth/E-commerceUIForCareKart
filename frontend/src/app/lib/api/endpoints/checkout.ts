import { api } from "../client";
import type { Order, PaymentMethod } from "../../../types/order";
import type { CartQuoteLineItem } from "../../../types/cart";

export interface PlaceOrderInput {
  addressId: number;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  // "Buy Now" — a single ad-hoc item bought without touching the real cart.
  buyNow?: CartQuoteLineItem;
}

export function placeOrder(input: PlaceOrderInput): Promise<Order> {
  return api.post("/checkout/orders", input);
}
