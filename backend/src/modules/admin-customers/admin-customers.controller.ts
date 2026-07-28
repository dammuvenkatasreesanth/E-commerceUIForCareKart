import type { Request, Response } from "express";
import * as service from "./admin-customers.service";
import { parseIdParam } from "../../lib/parseId";
import { writeAudit } from "../../middleware/audit.middleware";

export async function list(req: Request, res: Response) {
  res.json(await service.listCustomers(req.query as unknown as Parameters<typeof service.listCustomers>[0]));
}

export async function getOne(req: Request, res: Response) {
  res.json(await service.getCustomer(parseIdParam(req.params.id)));
}

export async function gstApproval(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  const user = await service.decideGstApproval(id, req.body.decision);
  await writeAudit({ actorId: req.user!.id, action: "customer.gst_approval", entityType: "User", entityId: id, metadata: req.body, ipAddress: req.ip });
  res.json(user);
}

export async function setStatus(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  const user = await service.setCustomerStatus(id, req.body.status);
  await writeAudit({ actorId: req.user!.id, action: "customer.status_change", entityType: "User", entityId: id, metadata: req.body, ipAddress: req.ip });
  res.json(user);
}
