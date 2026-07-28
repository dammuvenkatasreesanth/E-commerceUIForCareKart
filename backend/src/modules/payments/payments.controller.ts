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
  const base64Response: string | undefined = req.body?.response;
  if (!base64Response) throw new BadRequestError("Missing response payload");
  const xVerify = req.headers["x-verify"] as string | undefined;

  await paymentsService.handleCallback(base64Response, xVerify);
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
