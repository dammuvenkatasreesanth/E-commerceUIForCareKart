import axios from "axios";
import crypto from "node:crypto";
import { env } from "../../config/env";
import { logger } from "../../lib/logger";
import { AppError } from "../../lib/errors";

const BASE_URL =
  env.PHONEPE_ENV === "PROD" ? "https://api.phonepe.com/apis/hermes" : "https://api-preprod.phonepe.com/apis/pg-sandbox";

const PAY_PATH = "/pg/v1/pay";

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

// crypto.timingSafeEqual throws on length mismatch rather than returning
// false, so check lengths first — a length mismatch isn't itself a secret,
// so this early return doesn't reintroduce a timing side-channel.
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function xVerifyFor(base64Payload: string, path: string): string {
  return `${sha256Hex(base64Payload + path + env.PHONEPE_SALT_KEY)}###${env.PHONEPE_SALT_INDEX}`;
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
  if (!env.PHONEPE_MERCHANT_ID || !env.PHONEPE_SALT_KEY) {
    throw new AppError(
      "Online payments are not configured yet. Please use Cash on Delivery, or contact support.",
      503,
    );
  }

  const payload = {
    merchantId: env.PHONEPE_MERCHANT_ID,
    merchantTransactionId: input.merchantTransactionId,
    merchantUserId: `user-${input.userId}`,
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
  const xVerify = xVerifyFor(base64Payload, PAY_PATH);

  try {
    const response = await axios.post(
      `${BASE_URL}${PAY_PATH}`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
        },
        timeout: 15_000,
      },
    );

    const redirectUrl = response.data?.data?.instrumentResponse?.redirectInfo?.url;
    if (!redirectUrl) {
      throw new Error("PhonePe response did not include a redirect URL");
    }
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

export function verifyAndDecodeCallback(base64Response: string, xVerifyHeader: string | undefined): PhonePeCallbackPayload {
  if (!xVerifyHeader) throw new AppError("Missing signature", 400);

  const expected = `${sha256Hex(base64Response + env.PHONEPE_SALT_KEY)}###${env.PHONEPE_SALT_INDEX}`;
  if (!safeEqual(expected, xVerifyHeader)) {
    logger.warn("PhonePe callback signature mismatch");
    throw new AppError("Invalid signature", 400);
  }

  const decoded = JSON.parse(Buffer.from(base64Response, "base64").toString("utf-8"));
  return {
    success: decoded.code === "PAYMENT_SUCCESS",
    code: decoded.code,
    merchantTransactionId: decoded.data?.merchantTransactionId,
    transactionId: decoded.data?.transactionId,
    amount: decoded.data?.amount,
    raw: decoded,
  };
}

export async function checkStatus(merchantTransactionId: string): Promise<PhonePeCallbackPayload> {
  const path = `/pg/v1/status/${env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`;
  const xVerify = `${sha256Hex(path + env.PHONEPE_SALT_KEY)}###${env.PHONEPE_SALT_INDEX}`;

  const response = await axios.get(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": xVerify,
      "X-MERCHANT-ID": env.PHONEPE_MERCHANT_ID,
    },
    timeout: 15_000,
  });

  const decoded = response.data;
  return {
    success: decoded.code === "PAYMENT_SUCCESS",
    code: decoded.code,
    merchantTransactionId: decoded.data?.merchantTransactionId ?? merchantTransactionId,
    transactionId: decoded.data?.transactionId,
    amount: decoded.data?.amount,
    raw: decoded,
  };
}
