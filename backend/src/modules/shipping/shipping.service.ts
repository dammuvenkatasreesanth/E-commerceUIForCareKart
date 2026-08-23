import { and, eq, isNotNull, isNull, lt, notInArray, or } from "drizzle-orm";
import { db } from "../../db";
import { orders, orderStatusHistory, returnRequests, type ORDER_STATUS } from "../../db/schema";
import { logger } from "../../lib/logger";
import { loadOrderItems } from "../../lib/orderRelations";
import * as delhivery from "../../providers/shipping/delhivery.provider";

type OrderStatus = (typeof ORDER_STATUS)[number];
type OrderRow = typeof orders.$inferSelect;

function buildItems(items: { hsnCode: string | null; productName: string }[]) {
  return items.map((i) => ({ hsnCode: i.hsnCode, description: i.productName }));
}

// Fires right after an order becomes CONFIRMED (COD placement or online
// payment success) — never blocks order placement; a Delhivery failure is
// logged, not surfaced to the customer, same as the order-confirmation email.
export async function createShipmentForOrder(orderId: number): Promise<void> {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order || order.trackingId) return; // already has a waybill — don't double-create

  const itemsByOrder = await loadOrderItems([orderId]);
  const items = itemsByOrder.get(orderId) ?? [];
  if (items.length === 0) return;

  const { waybill } = await delhivery.createShipment({
    orderNumber: order.orderNumber,
    name: order.shipName,
    phone: order.shipPhone,
    addressLine1: order.shipLine1,
    addressLine2: order.shipLine2,
    city: order.shipCity,
    state: order.shipState,
    pincode: order.shipPincode,
    paymentMode: order.paymentMethod === "COD" ? "COD" : "Prepaid",
    codAmount: order.paymentMethod === "COD" ? Number(order.totalAmount) : undefined,
    items: buildItems(items),
  });

  await db.update(orders).set({ trackingId: waybill, carrier: "DELHIVERY", updatedAt: new Date() }).where(eq(orders.id, orderId));
}

export async function createReturnShipmentForOrder(orderId: number, returnRequestId: number): Promise<void> {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return;

  const itemsByOrder = await loadOrderItems([orderId]);
  const items = itemsByOrder.get(orderId) ?? [];
  if (items.length === 0) return;

  const { waybill } = await delhivery.createReturnShipment({
    orderNumber: order.orderNumber,
    name: order.shipName,
    phone: order.shipPhone,
    addressLine1: order.shipLine1,
    addressLine2: order.shipLine2,
    city: order.shipCity,
    state: order.shipState,
    pincode: order.shipPincode,
    items: buildItems(items),
  });

  await db.update(returnRequests).set({ returnWaybill: waybill, updatedAt: new Date() }).where(eq(returnRequests.id, returnRequestId));
}

// Best-effort — a shipment may already exist in Delhivery's system even
// though our own status hasn't reached SHIPPED yet (created at CONFIRMED,
// before the tracking sweep has caught up), so cancelOrder calls this too.
export async function cancelShipmentForOrder(waybill: string): Promise<void> {
  try {
    await delhivery.cancelShipment(waybill);
  } catch (err) {
    logger.warn({ err, waybill }, "Failed to cancel Delhivery shipment (order was still cancelled)");
  }
}

// Coarse mapping from Delhivery's free-text status to our own ORDER_STATUS
// ladder — verify these literal strings against a real account before this
// goes live for real customer orders (see shipping.provider's tracking notes).
function mapDelhiveryStatus(raw: string | null): OrderStatus | null {
  if (!raw) return null;
  const s = raw.toLowerCase();
  if (s.includes("delivered")) return "DELIVERED";
  if (s.includes("out for delivery")) return "OUT_FOR_DELIVERY";
  if (s.includes("dispatch") || s.includes("in transit") || s.includes("manifest")) return "SHIPPED";
  return null;
}

const TERMINAL_STATUSES: OrderStatus[] = ["DELIVERED", "CANCELLED", "RETURNED"];
const SWEEP_STALE_MINUTES = 30;

export async function sweepActiveShipments(): Promise<void> {
  const cutoff = new Date(Date.now() - SWEEP_STALE_MINUTES * 60 * 1000);
  const toCheck = await db
    .select()
    .from(orders)
    .where(
      and(
        isNotNull(orders.trackingId),
        notInArray(orders.status, TERMINAL_STATUSES),
        or(isNull(orders.shippingLastCheckedAt), lt(orders.shippingLastCheckedAt, cutoff)),
      ),
    );

  for (const order of toCheck) {
    await trackAndApply(order);
  }
}

async function trackAndApply(order: OrderRow): Promise<void> {
  if (!order.trackingId) return;
  try {
    const { status, raw } = await delhivery.trackShipment(order.trackingId);
    const mapped = mapDelhiveryStatus(status);

    await db
      .update(orders)
      .set({
        shippingStatus: status,
        shippingRawResponse: raw as object,
        shippingLastCheckedAt: new Date(),
        status: mapped && mapped !== order.status ? mapped : order.status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    if (mapped && mapped !== order.status) {
      await db.insert(orderStatusHistory).values({ orderId: order.id, fromStatus: order.status, toStatus: mapped, note: `Delhivery: ${status}` });
    }
  } catch (err) {
    logger.error({ err, orderId: order.id, waybill: order.trackingId }, "Failed to track Delhivery shipment");
    await db.update(orders).set({ shippingLastCheckedAt: new Date(), updatedAt: new Date() }).where(eq(orders.id, order.id));
  }
}

// Bypasses the sweep's staleness cutoff — used by the admin "Refresh tracking" button.
export async function refreshTrackingNow(orderId: number): Promise<OrderRow> {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order || !order.trackingId) throw new Error("Order has no Delhivery tracking ID");
  await trackAndApply(order);
  const [updated] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return updated!;
}
