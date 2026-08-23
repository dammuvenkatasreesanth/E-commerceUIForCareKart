export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED";

export type PaymentMethod = "UPI" | "CARD" | "NETBANKING" | "PHONEPE" | "COD";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number | null;
  productName: string;
  imageUrl: string | null;
  sizeLabel: string;
  tierIndex: number;
  packQty: number;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
  gstRate: string;
  hsnCode: string | null;
}

export interface OrderStatusHistoryEntry {
  id: number;
  orderId: number;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  note: string | null;
  createdAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: string;
  discountAmount: string;
  shippingAmount: string;
  taxAmount: string;
  totalAmount: string;
  shipName: string;
  shipPhone: string;
  shipLine1: string;
  shipLine2: string | null;
  shipCity: string;
  shipState: string;
  shipPincode: string;
  trackingId: string | null;
  carrier: string | null;
  shippingStatus: string | null;
  shippingLastCheckedAt: string | null;
  cancelReason: string | null;
  cancelledAt: string | null;
  placedAt: string;
  createdAt: string;
  items: OrderItem[];
  statusHistory?: OrderStatusHistoryEntry[];
}

export interface ReturnRequest {
  id: number;
  orderId: number;
  orderItemId: number | null;
  userId: number;
  reason: string;
  requestedQty: number;
  status: string;
}

export interface ReorderResult {
  cart: import("./cart").CartResponse;
  added: string[];
  skipped: string[];
}
