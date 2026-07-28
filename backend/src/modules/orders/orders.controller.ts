import type { Request, Response } from "express";
import * as ordersService from "./orders.service";
import { UnauthorizedError } from "../../lib/errors";
import { parseIdParam } from "../../lib/parseId";

export async function list(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  res.json(await ordersService.listOrdersForUser(req.user.id));
}

export async function getOne(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const id = parseIdParam(req.params.id, "order id");
  res.json(await ordersService.getOrderForRoleAccess(req.user, id));
}

export async function cancel(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const id = parseIdParam(req.params.id, "order id");
  res.json(await ordersService.cancelOrder(req.user, id, req.body.reason));
}

export async function requestReturn(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const id = parseIdParam(req.params.id, "order id");
  res.status(201).json(await ordersService.requestReturn(req.user, id, req.body));
}

export async function reorder(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const id = parseIdParam(req.params.id, "order id");
  res.json(await ordersService.reorder(req.user.id, id));
}

export async function downloadInvoice(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const id = parseIdParam(req.params.id, "order id");
  const { buffer, filename } = await ordersService.getInvoicePdf(req.user, id);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(buffer);
}
