import type { OrderStatus } from "../types/order";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURN_REQUESTED: "Return Requested",
  RETURNED: "Returned",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "text-amber-600 bg-amber-50",
  CONFIRMED: "text-blue-600 bg-blue-50",
  PROCESSING: "text-blue-600 bg-blue-50",
  PACKED: "text-blue-600 bg-blue-50",
  SHIPPED: "text-blue-600 bg-blue-50",
  OUT_FOR_DELIVERY: "text-blue-600 bg-blue-50",
  DELIVERED: "text-emerald-600 bg-emerald-50",
  CANCELLED: "text-red-600 bg-red-50",
  RETURN_REQUESTED: "text-amber-600 bg-amber-50",
  RETURNED: "text-muted-foreground bg-muted",
};

export const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED"];

const STATUS_ORDER: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

/** Standard happy-path steps for the shipment timeline — statusHistory entries
 * are matched against these; anything off the happy path (cancelled/returned)
 * is rendered separately rather than forced into this ladder. */
export function timelineSteps(): OrderStatus[] {
  return STATUS_ORDER;
}
