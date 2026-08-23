import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { listOrdersQuerySchema, updateOrderStatusSchema, initiateRefundSchema } from "./admin-orders.schema";
import * as controller from "./admin-orders.controller";

export const adminOrdersRouter = Router();

adminOrdersRouter.use(authenticate, requireRole("ADMIN"));

adminOrdersRouter.get("/export", validate({ query: listOrdersQuerySchema }), asyncHandler(controller.exportCsv));
adminOrdersRouter.get("/", validate({ query: listOrdersQuerySchema }), asyncHandler(controller.list));
adminOrdersRouter.get("/:id", asyncHandler(controller.getOne));
adminOrdersRouter.patch("/:id/status", validate({ body: updateOrderStatusSchema }), asyncHandler(controller.updateStatus));
adminOrdersRouter.post("/:id/refresh-tracking", asyncHandler(controller.refreshTracking));
adminOrdersRouter.post("/schedule-pickup", asyncHandler(controller.schedulePickup));
adminOrdersRouter.post("/:id/refund", validate({ body: initiateRefundSchema }), asyncHandler(controller.refund));
