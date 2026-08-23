import { and, eq, inArray, isNotNull, isNull, lt, notInArray, or } from "drizzle-orm";
import { db } from "../../db";
import { orders, orderStatusHistory, returnRequests, shippingBoxSizes, type ORDER_STATUS } from "../../db/schema";
import { logger } from "../../lib/logger";
import { loadOrderItems } from "../../lib/orderRelations";
import * as delhivery from "../../providers/shipping/delhivery.provider";

type OrderStatus = (typeof ORDER_STATUS)[number];
type OrderRow = typeof orders.$inferSelect;

function buildItems(items: { hsnCode: string | null; productName: string }[]) {
  return items.map((i) => ({ hsnCode: i.hsnCode, description: i.productName }));
}

// Falls back to a conservative estimate for items with no weight set on the
// product yet, so shipments never go out as a literal 0g (Delhivery may
// mis-handle/mis-price an unweighted parcel).
const DEFAULT_ITEM_WEIGHT_GRAMS = 250;

function totalWeightGrams(items: { weightGrams: number | null; quantity: number }[]): number {
  return items.reduce((sum, i) => sum + (i.weightGrams ?? DEFAULT_ITEM_WEIGHT_GRAMS) * i.quantity, 0);
}

// Box size varies by product (a bulky product's "pack of 5" box isn't the
// same as a compact one's), so each order line is looked up against its own
// product's box-size table — boxCount for a line is packQty (boxes per
// pack) × quantity (packs ordered), rounded UP to the smallest configured
// size that's big enough (never under-sized), capping at that product's
// largest configured size for anything beyond it. Lines with no box sizes
// configured are skipped rather than failing the whole lookup.
async function shipmentDimensionsCm(items: { productId: number | null; packQty: number; quantity: number }[]) {
  const productIds = [...new Set(items.map((i) => i.productId).filter((id): id is number => id != null))];
  if (productIds.length === 0) return undefined;

  const allSizes = await db.select().from(shippingBoxSizes).where(inArray(shippingBoxSizes.productId, productIds));

  const lineDimensions = items
    .map((item) => {
      if (item.productId == null) return undefined;
      const sizes = allSizes.filter((s) => s.productId === item.productId).sort((a, b) => a.boxCount - b.boxCount);
      if (sizes.length === 0) return undefined;
      const boxCount = Math.max(item.packQty * item.quantity, 1);
      const match = sizes.find((s) => s.boxCount >= boxCount) ?? sizes[sizes.length - 1];
      return { lengthCm: match.lengthCm, widthCm: match.widthCm, heightCm: match.heightCm };
    })
    .filter((d): d is { lengthCm: number; widthCm: number; heightCm: number } => d != null);

  if (lineDimensions.length === 0) return undefined;

  // Multi-item orders: the single shipment box needs to be at least as big
  // as the largest line's requirement along each axis.
  return {
    lengthCm: Math.max(...lineDimensions.map((d) => d.lengthCm)),
    widthCm: Math.max(...lineDimensions.map((d) => d.widthCm)),
    heightCm: Math.max(...lineDimensions.map((d) => d.heightCm)),
  };
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
    weightGrams: totalWeightGrams(items),
    ...(await shipmentDimensionsCm(items)),
  });

  await db.update(orders).set({ trackingId: waybill, carrier: "DELHIVERY", updatedAt: new Date() }).where(eq(orders.id, orderId));
  // Pickup is a manual, admin-triggered step (see schedulePickup below) — the
  // order just needs to show up as a pending AWB on Delhivery's side for the
  // team to process from there, not get swept into an automatic pickup.
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
    weightGrams: totalWeightGrams(items),
    ...(await shipmentDimensionsCm(items)),
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
// Cancellation in particular doesn't show up in `status` itself (confirmed
// against a real cancelled shipment: status stayed "Not Picked") — Delhivery
// puts the actual reason in `instructions` instead (e.g. "Seller cancelled
// the order"), so that has to be checked too, and takes priority.
function mapDelhiveryStatus(status: string | null, instructions: string | null): OrderStatus | null {
  const instructionsLower = instructions?.toLowerCase() ?? "";
  if (instructionsLower.includes("cancel")) return "CANCELLED";

  if (!status) return null;
  const s = status.toLowerCase();
  if (s.includes("cancel")) return "CANCELLED";
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
    const { status, instructions, raw } = await delhivery.trackShipment(order.trackingId);
    const mapped = mapDelhiveryStatus(status, instructions);
    const statusChanged = mapped && mapped !== order.status;

    await db
      .update(orders)
      .set({
        shippingStatus: status,
        shippingRawResponse: raw as object,
        shippingLastCheckedAt: new Date(),
        status: statusChanged ? mapped : order.status,
        cancelledAt: statusChanged && mapped === "CANCELLED" ? new Date() : order.cancelledAt,
        cancelReason: statusChanged && mapped === "CANCELLED" ? (instructions ?? "Cancelled by Delhivery") : order.cancelReason,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    if (statusChanged) {
      await db.insert(orderStatusHistory).values({ orderId: order.id, fromStatus: order.status, toStatus: mapped, note: `Delhivery: ${instructions ?? status}` });
    }
  } catch (err) {
    logger.error({ err, orderId: order.id, waybill: order.trackingId }, "Failed to track Delhivery shipment");
    await db.update(orders).set({ shippingLastCheckedAt: new Date(), updatedAt: new Date() }).where(eq(orders.id, order.id));
  }
}

// Admin-triggered — schedules today's courier pickup for every shipment
// that's been manifested but not yet reported as picked up. expectedCount
// defaults to counting today's not-yet-shipped Delhivery orders.
export async function schedulePickup(input?: { pickupDate?: string; pickupTime?: string; expectedPackageCount?: number }) {
  const pickupDate = input?.pickupDate ?? new Date().toISOString().slice(0, 10);
  const pickupTime = input?.pickupTime ?? "14:00:00";

  let expectedPackageCount = input?.expectedPackageCount;
  if (expectedPackageCount == null) {
    const pending = await db
      .select()
      .from(orders)
      .where(and(eq(orders.carrier, "DELHIVERY"), notInArray(orders.status, ["SHIPPED", "OUT_FOR_DELIVERY", ...TERMINAL_STATUSES])));
    expectedPackageCount = pending.length;
  }

  return delhivery.createPickupRequest({ pickupDate, pickupTime, expectedPackageCount });
}

// Bypasses the sweep's staleness cutoff — used by the admin "Refresh tracking" button.
export async function refreshTrackingNow(orderId: number): Promise<OrderRow> {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order || !order.trackingId) throw new Error("Order has no Delhivery tracking ID");
  await trackAndApply(order);
  const [updated] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return updated!;
}
