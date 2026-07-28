import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { cancelOrderSchema, returnOrderSchema } from "./orders.schema";
import * as controller from "./orders.controller";

export const ordersRouter = Router();

ordersRouter.use(authenticate);

ordersRouter.get("/", asyncHandler(controller.list));
ordersRouter.get("/:id", asyncHandler(controller.getOne));
ordersRouter.get("/:id/invoice", asyncHandler(controller.downloadInvoice));
ordersRouter.post("/:id/cancel", validate({ body: cancelOrderSchema }), asyncHandler(controller.cancel));
ordersRouter.post("/:id/return", validate({ body: returnOrderSchema }), asyncHandler(controller.requestReturn));
ordersRouter.post("/:id/reorder", asyncHandler(controller.reorder));
