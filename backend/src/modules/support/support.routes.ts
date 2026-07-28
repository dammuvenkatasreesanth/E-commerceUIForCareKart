import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createTicketSchema } from "./support.schema";
import * as controller from "./support.controller";

export const supportRouter = Router();

supportRouter.use(authenticate);

supportRouter.get("/tickets", asyncHandler(controller.listMine));
supportRouter.post("/tickets", validate({ body: createTicketSchema }), asyncHandler(controller.create));
supportRouter.get("/tickets/:id", asyncHandler(controller.getMine));
