import type { Request, Response } from "express";
import * as paymentsService from "./payments.service";
import { UnauthorizedError, BadRequestError } from "../../lib/errors";
import { parseIdParam } from "../../lib/parseId";
import { env } from "../../config/env";

export async function initiate(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const orderId = parseIdParam(String(req.body.orderId), "order id");
  const result = await paymentsService.initiate(req.user.id, orderId);
  res.status(201).json(result);
}

export async function callback(req: Request, res: Response) {
  // V1's S2S callback posts { "response": "<base64>" } with an X-VERIFY header
  // (not Authorization) — the checksum covers that base64 string, not the raw body.
  const base64Response = req.body?.response as string | undefined;
  if (!base64Response) throw new BadRequestError("Missing request body");
  const xVerify = req.headers["x-verify"] as string | undefined;

  await paymentsService.handleCallback(xVerify, base64Response);
  res.status(200).json({ success: true });
}

export async function redirect(req: Request, res: Response) {
  const mtx = req.query.mtx as string | undefined;
  if (!mtx) {
    res.redirect(302, `${env.FRONTEND_ORDER_CONFIRMATION_URL}?status=error`);
    return;
  }

  try {
    const result = await paymentsService.reconcile(mtx);
    const statusParam = result.status === "SUCCESS" ? "success" : "failed";
    res.redirect(302, `${env.FRONTEND_ORDER_CONFIRMATION_URL}?orderId=${result.orderId}&status=${statusParam}`);
  } catch {
    res.redirect(302, `${env.FRONTEND_ORDER_CONFIRMATION_URL}?status=error`);
  }
}

export async function getStatus(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const orderId = parseIdParam(req.params.orderId, "order id");
  res.json(await paymentsService.getStatus(req.user.id, orderId));
}
