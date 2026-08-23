import type { Request, Response } from "express";
import * as service from "./admin-orders.service";
import { parseIdParam } from "../../lib/parseId";
import { writeAudit } from "../../middleware/audit.middleware";

type ListQuery = Parameters<typeof service.listOrders>[0];

export async function list(req: Request, res: Response) {
  res.json(await service.listOrders(req.query as unknown as ListQuery));
}

export async function getOne(req: Request, res: Response) {
  res.json(await service.getOrder(parseIdParam(req.params.id)));
}

export async function updateStatus(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  const order = await service.updateOrderStatus(req.user!.id, id, req.body);
  await writeAudit({ actorId: req.user!.id, action: "order.status_override", entityType: "Order", entityId: id, metadata: req.body, ipAddress: req.ip });
  res.json(order);
}

export async function refreshTracking(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  const order = await service.refreshShipmentTracking(id);
  res.json(order);
}

export async function refund(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  const refundRecord = await service.initiateRefund(req.user!.id, id, req.body);
  await writeAudit({ actorId: req.user!.id, action: "order.refund_initiated", entityType: "Order", entityId: id, metadata: req.body, ipAddress: req.ip });
  res.status(201).json(refundRecord);
}

export async function exportCsv(req: Request, res: Response) {
  const csv = await service.exportOrdersCsv(req.query as unknown as ListQuery);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="orders-export.csv"`);
  res.send(csv);
}
