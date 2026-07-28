import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth.middleware";
import * as controller from "./reports.controller";

export const reportsRouter = Router();

reportsRouter.use(authenticate, requireRole("ADMIN"));

reportsRouter.get("/dashboard", asyncHandler(controller.dashboard));
reportsRouter.get("/sales-trend", asyncHandler(controller.salesTrend));
reportsRouter.get("/alerts/pending-orders", asyncHandler(controller.pendingOrderAlerts));
reportsRouter.get("/export/sales.csv", asyncHandler(controller.exportSales));
reportsRouter.get("/export/customers.csv", asyncHandler(controller.exportCustomers));
reportsRouter.get("/export/coupons.csv", asyncHandler(controller.exportCoupons));
