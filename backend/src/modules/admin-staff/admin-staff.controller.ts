import type { Request, Response } from "express";
import * as service from "./admin-staff.service";
import { parseIdParam } from "../../lib/parseId";
import { writeAudit } from "../../middleware/audit.middleware";

export async function list(_req: Request, res: Response) {
  res.json(await service.listStaff());
}

export async function create(req: Request, res: Response) {
  const staff = await service.createStaff(req.user!.id, req.body);
  await writeAudit({ actorId: req.user!.id, action: "staff.invite_created", entityType: "User", entityId: staff.id, metadata: { email: staff.email, role: staff.role }, ipAddress: req.ip });
  res.status(201).json({ id: staff.id, email: staff.email, name: staff.name, role: staff.role, status: staff.status });
}

export async function updateRole(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  const staff = await service.updateStaffRole(id, req.body.role);
  await writeAudit({ actorId: req.user!.id, action: "staff.role_update", entityType: "User", entityId: id, metadata: req.body, ipAddress: req.ip });
  res.json(staff);
}

export async function updateStatus(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  const staff = await service.updateStaffStatus(req.user!.id, id, req.body.status);
  await writeAudit({ actorId: req.user!.id, action: "staff.status_update", entityType: "User", entityId: id, metadata: req.body, ipAddress: req.ip });
  res.json(staff);
}

export async function auditLog(req: Request, res: Response) {
  res.json(await service.listAuditLog(req.query as unknown as Parameters<typeof service.listAuditLog>[0]));
}
