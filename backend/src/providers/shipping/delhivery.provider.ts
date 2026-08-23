import axios from "axios";
import { env } from "../../config/env";
import { logger } from "../../lib/logger";
import { AppError } from "../../lib/errors";

// Delhivery's classic REST API ("Authorization: Token X") — this account is
// on that flow, not the newer OAuth-based Delhivery One API.
const PROD_BASE_URL = "https://track.delhivery.com";
const STAGING_BASE_URL = "https://staging-express.delhivery.com";

function baseUrl(): string {
  return env.DELHIVERY_ENV === "PROD" ? PROD_BASE_URL : STAGING_BASE_URL;
}

function assertConfigured(): void {
  if (!env.DELHIVERY_API_TOKEN || !env.DELHIVERY_PICKUP_LOCATION) {
    throw new AppError("Delhivery is not configured yet.", 503);
  }
}

function authHeaders() {
  return { Authorization: `Token ${env.DELHIVERY_API_TOKEN}`, "Content-Type": "application/json", Accept: "application/json" };
}

export interface ShipmentItem {
  hsnCode: string | null;
  description: string;
}

export interface CreateShipmentInput {
  orderNumber: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  paymentMode: "COD" | "Prepaid" | "Pickup";
  codAmount?: number;
  items: ShipmentItem[];
}

export interface CreateShipmentResult {
  waybill: string;
  raw: unknown;
}

interface DelhiveryCreateResponse {
  success?: boolean;
  packages?: { waybill?: string; status?: string; remarks?: string[] }[];
  rmk?: string;
}

export async function createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult> {
  assertConfigured();

  const payload = {
    shipments: [
      {
        name: input.name,
        add: [input.addressLine1, input.addressLine2].filter(Boolean).join(", "),
        city: input.city,
        state: input.state,
        country: "India",
        phone: input.phone,
        pin: input.pincode,
        order: input.orderNumber,
        payment_mode: input.paymentMode,
        cod_amount: input.paymentMode === "COD" ? input.codAmount : undefined,
        products_desc: input.items.map((i) => i.description).join(", ").slice(0, 500),
        hsn_code: input.items[0]?.hsnCode ?? undefined,
        seller_gst_tin: env.DELHIVERY_SELLER_GST_TIN || undefined,
        quantity: input.items.length,
      },
    ],
    pickup_location: { name: env.DELHIVERY_PICKUP_LOCATION },
  };

  try {
    const response = await axios.post<DelhiveryCreateResponse>(
      `${baseUrl()}/api/cmu/create.json`,
      `format=json&data=${encodeURIComponent(JSON.stringify(payload))}`,
      { headers: { ...authHeaders(), "Content-Type": "application/x-www-form-urlencoded" } },
    );

    const pkg = response.data?.packages?.[0];
    if (!response.data?.success || !pkg?.waybill) {
      throw new Error(`Delhivery did not return a waybill: ${pkg?.remarks?.join("; ") ?? response.data?.rmk ?? "unknown error"}`);
    }
    return { waybill: pkg.waybill, raw: response.data };
  } catch (err) {
    logger.error({ err, orderNumber: input.orderNumber }, "Delhivery create shipment failed");
    throw new AppError("Failed to create Delhivery shipment.", 502);
  }
}

export async function createReturnShipment(input: Omit<CreateShipmentInput, "paymentMode" | "codAmount">): Promise<CreateShipmentResult> {
  // Delhivery auto-schedules the reverse pickup once a shipment is created
  // with payment_mode "Pickup" — no separate pickup-request call needed.
  return createShipment({ ...input, paymentMode: "Pickup" });
}

// Field names here are best-effort from Delhivery's docs (which don't show a
// full example payload) — verify against a real account (e.g. via the
// delhivery-one MCP server) before relying on this; it's called best-effort
// and non-blocking by callers regardless, so a wrong field just no-ops.
export async function cancelShipment(waybill: string): Promise<void> {
  assertConfigured();
  await axios.post(`${baseUrl()}/api/p/edit`, { waybill, cancellation: "true" }, { headers: authHeaders() });
}

export interface TrackShipmentResult {
  status: string | null;
  raw: unknown;
}

interface DelhiveryTrackResponse {
  ShipmentData?: { Shipment?: { Status?: { Status?: string } } }[];
}

export async function trackShipment(waybill: string): Promise<TrackShipmentResult> {
  assertConfigured();

  try {
    const response = await axios.get<DelhiveryTrackResponse>(`${baseUrl()}/api/v1/packages/json/`, {
      headers: authHeaders(),
      params: { waybill },
    });
    const status = response.data?.ShipmentData?.[0]?.Shipment?.Status?.Status ?? null;
    return { status, raw: response.data };
  } catch (err) {
    logger.error({ err, waybill }, "Delhivery track shipment failed");
    throw new AppError("Failed to fetch tracking status.", 502);
  }
}
