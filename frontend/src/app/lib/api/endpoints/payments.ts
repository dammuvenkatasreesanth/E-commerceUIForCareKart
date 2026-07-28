import { api } from "../client";

export function initiatePayment(orderId: number): Promise<{ redirectUrl: string; merchantTransactionId: string }> {
  return api.post("/payments/phonepe/initiate", { orderId });
}
