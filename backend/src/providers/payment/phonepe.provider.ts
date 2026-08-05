import { StandardCheckoutClient, StandardCheckoutPayRequest, Env } from "@phonepe-pg/pg-sdk-node";
import { env } from "../../config/env";
import { logger } from "../../lib/logger";
import { AppError } from "../../lib/errors";

let client: StandardCheckoutClient | undefined;

function getClient(): StandardCheckoutClient {
  if (!env.PHONEPE_CLIENT_ID || !env.PHONEPE_CLIENT_SECRET) {
    throw new AppError(
      "Online payments are not configured yet. Please use Cash on Delivery, or contact support.",
      503,
    );
  }
  if (!client) {
    client = StandardCheckoutClient.getInstance(
      env.PHONEPE_CLIENT_ID,
      env.PHONEPE_CLIENT_SECRET,
      env.PHONEPE_CLIENT_VERSION,
      env.PHONEPE_ENV === "PROD" ? Env.PRODUCTION : Env.SANDBOX,
    );
  }
  return client;
}

// PhonePe's order states, per the v2 Standard Checkout API.
function isSuccessState(state: string): boolean {
  return state === "COMPLETED";
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
  const phonepe = getClient();

  const request = StandardCheckoutPayRequest.builder()
    .merchantOrderId(input.merchantTransactionId)
    .amount(Math.round(input.amountRupees * 100)) // paise
    // GET redirect back to our own backend (not the frontend) so we can reconcile
    // the payment status server-side via the Order Status API before the browser
    // ever reaches the frontend confirmation page.
    .redirectUrl(`${env.PUBLIC_API_BASE_URL}/payments/phonepe/redirect?mtx=${encodeURIComponent(input.merchantTransactionId)}`)
    .build();

  try {
    const response = await phonepe.pay(request);
    if (!response.redirectUrl) throw new Error("PhonePe response did not include a redirect URL");
    return { redirectUrl: response.redirectUrl };
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

export function verifyAndDecodeCallback(authorizationHeader: string | undefined, rawBody: string): PhonePeCallbackPayload {
  if (!authorizationHeader) throw new AppError("Missing signature", 400);
  if (!env.PHONEPE_WEBHOOK_USERNAME || !env.PHONEPE_WEBHOOK_PASSWORD) {
    throw new AppError("Webhook is not configured", 503);
  }

  const phonepe = getClient();

  let result;
  try {
    result = phonepe.validateCallback(env.PHONEPE_WEBHOOK_USERNAME, env.PHONEPE_WEBHOOK_PASSWORD, authorizationHeader, rawBody);
  } catch (err) {
    logger.warn({ err }, "PhonePe callback signature mismatch");
    throw new AppError("Invalid signature", 400);
  }

  const payload = result.payload;
  return {
    success: isSuccessState(payload.state),
    code: payload.state,
    merchantTransactionId: payload.merchantOrderId ?? "",
    transactionId: payload.orderId,
    amount: payload.amount,
    raw: result,
  };
}

export async function checkStatus(merchantTransactionId: string): Promise<PhonePeCallbackPayload> {
  const phonepe = getClient();
  const response = await phonepe.getOrderStatus(merchantTransactionId);

  return {
    success: isSuccessState(response.state),
    code: response.state,
    merchantTransactionId: response.merchantOrderId ?? merchantTransactionId,
    transactionId: response.orderId,
    amount: response.amount,
    raw: response,
  };
}
