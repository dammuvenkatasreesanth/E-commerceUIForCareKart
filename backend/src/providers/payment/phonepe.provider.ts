import crypto from "node:crypto";
import axios from "axios";
import { env } from "../../config/env";
import { logger } from "../../lib/logger";
import { AppError } from "../../lib/errors";

// PhonePe's V1 "Standard Checkout" API (Salt Key + Salt Index auth) — this
// merchant account is provisioned on V1, not V2 (Client ID/Secret/Version),
// and PhonePe's official Node SDK (@phonepe-pg/pg-sdk-node) only covers V2.
// So this talks to the documented V1 REST API directly.
const PROD_BASE_URL = "https://api.phonepe.com/apis/hermes";
const UAT_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";

function baseUrl(): string {
  return env.PHONEPE_ENV === "PROD" ? PROD_BASE_URL : UAT_BASE_URL;
}

function assertConfigured(): void {
  if (!env.PHONEPE_MERCHANT_ID || !env.PHONEPE_SALT_KEY) {
    throw new AppError("Online payments are not configured yet. Please use Cash on Delivery, or contact support.", 503);
  }
}

// V1's X-VERIFY: sha256(payload-or-empty + endpointPath + saltKey) + "###" + saltIndex.
function xVerify(endpoint: string, base64Payload = ""): string {
  const hash = crypto.createHash("sha256").update(base64Payload + endpoint + env.PHONEPE_SALT_KEY).digest("hex");
  return `${hash}###${env.PHONEPE_SALT_INDEX}`;
}

interface PhonePeApiResponse {
  success: boolean;
  code: string;
  message?: string;
  data?: {
    merchantId?: string;
    merchantTransactionId?: string;
    transactionId?: string;
    amount?: number;
    state?: string;
    instrumentResponse?: { redirectInfo?: { url?: string } };
  };
}

export interface InitiatePaymentInput {
  merchantTransactionId: string;
  amountRupees: number;
  userId: number;
}

export interface InitiatePaymentResult {
  redirectUrl: string;
}

export async function initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
  assertConfigured();

  const payload = {
    merchantId: env.PHONEPE_MERCHANT_ID,
    merchantTransactionId: input.merchantTransactionId,
    merchantUserId: `U${input.userId}`,
    amount: Math.round(input.amountRupees * 100), // paise
    // GET redirect back to our own backend (not the frontend) so we can reconcile
    // the payment status server-side via the Check Status API before the browser
    // ever reaches the frontend confirmation page.
    redirectUrl: `${env.PUBLIC_API_BASE_URL}/payments/phonepe/redirect?mtx=${encodeURIComponent(input.merchantTransactionId)}`,
    redirectMode: "REDIRECT",
    callbackUrl: `${env.PUBLIC_API_BASE_URL}/payments/phonepe/callback`,
    paymentInstrument: { type: "PAY_PAGE" },
  };
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const endpoint = "/pg/v1/pay";

  try {
    const response = await axios.post<PhonePeApiResponse>(
      `${baseUrl()}${endpoint}`,
      { request: base64Payload },
      { headers: { "Content-Type": "application/json", accept: "application/json", "X-VERIFY": xVerify(endpoint, base64Payload) } },
    );

    const redirectUrl = response.data?.data?.instrumentResponse?.redirectInfo?.url;
    if (!response.data?.success || !redirectUrl) throw new Error(`PhonePe pay request did not return a redirect URL: ${response.data?.code}`);
    return { redirectUrl };
  } catch (err) {
    logger.error({ err }, "PhonePe initiate payment failed");
    throw new AppError("Failed to initiate payment. Please try again.", 502);
  }
}

export interface PhonePeCallbackPayload {
  success: boolean;
  code: string;
  merchantTransactionId: string;
  transactionId?: string;
  amount?: number;
  raw: unknown;
}

function normalize(resp: PhonePeApiResponse): PhonePeCallbackPayload {
  return {
    success: resp.code === "PAYMENT_SUCCESS",
    code: resp.code,
    merchantTransactionId: resp.data?.merchantTransactionId ?? "",
    transactionId: resp.data?.transactionId,
    amount: resp.data?.amount,
    raw: resp,
  };
}

// V1 posts { "response": "<base64>" } with an X-VERIFY header (not Authorization)
// computed over that same base64 string — no separate webhook username/password
// needed, it reuses the account's Salt Key.
export function verifyAndDecodeCallback(xVerifyHeader: string | undefined, base64Response: string): PhonePeCallbackPayload {
  assertConfigured();
  if (!xVerifyHeader) throw new AppError("Missing signature", 400);
  if (!base64Response) throw new AppError("Missing request body", 400);

  const expected = crypto.createHash("sha256").update(base64Response + env.PHONEPE_SALT_KEY).digest("hex") + `###${env.PHONEPE_SALT_INDEX}`;
  if (xVerifyHeader !== expected) {
    logger.warn("PhonePe callback signature mismatch");
    throw new AppError("Invalid signature", 400);
  }

  const decoded = JSON.parse(Buffer.from(base64Response, "base64").toString("utf-8")) as PhonePeApiResponse;
  return normalize(decoded);
}

export async function checkStatus(merchantTransactionId: string): Promise<PhonePeCallbackPayload> {
  assertConfigured();
  const endpoint = `/pg/v1/status/${env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`;

  try {
    const response = await axios.get<PhonePeApiResponse>(`${baseUrl()}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "X-VERIFY": xVerify(endpoint),
        "X-MERCHANT-ID": env.PHONEPE_MERCHANT_ID,
      },
    });
    return normalize(response.data);
  } catch (err) {
    logger.error({ err, merchantTransactionId }, "PhonePe status check failed");
    throw new AppError("Failed to check payment status.", 502);
  }
}
