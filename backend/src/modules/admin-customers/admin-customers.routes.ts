import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { listCustomersQuerySchema, gstApprovalSchema, customerStatusSchema } from "./admin-customers.schema";
import * as controller from "./admin-customers.controller";

export const adminCustomersRouter = Router();

adminCustomersRouter.use(authenticate, requireRole("ADMIN"));

adminCustomersRouter.get("/", validate({ query: listCustomersQuerySchema }), asyncHandler(controller.list));
adminCustomersRouter.get("/:id", asyncHandler(controller.getOne));
adminCustomersRouter.patch("/:id/gst-approval", validate({ body: gstApprovalSchema }), asyncHandler(controller.gstApproval));
adminCustomersRouter.patch("/:id/status", validate({ body: customerStatusSchema }), asyncHandler(controller.setStatus));
