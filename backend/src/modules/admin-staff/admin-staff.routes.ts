import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createStaffSchema, updateStaffRoleSchema, updateStaffStatusSchema, auditLogQuerySchema } from "./admin-staff.schema";
import * as controller from "./admin-staff.controller";

export const adminStaffRouter = Router();

adminStaffRouter.use(authenticate, requireRole("ADMIN"));

adminStaffRouter.get("/", asyncHandler(controller.list));
adminStaffRouter.post("/", validate({ body: createStaffSchema }), asyncHandler(controller.create));
adminStaffRouter.patch("/:id/role", validate({ body: updateStaffRoleSchema }), asyncHandler(controller.updateRole));
adminStaffRouter.patch("/:id/status", validate({ body: updateStaffStatusSchema }), asyncHandler(controller.updateStatus));

export const adminAuditLogRouter = Router();
adminAuditLogRouter.get("/", authenticate, requireRole("ADMIN"), validate({ query: auditLogQuerySchema }), asyncHandler(controller.auditLog));
