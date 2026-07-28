import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { validate } from "../../middleware/validate.middleware";
import { createAddressSchema, updateAddressSchema } from "./addresses.schema";
import * as controller from "./addresses.controller";

export const addressesRouter = Router();

addressesRouter.get("/", asyncHandler(controller.list));
addressesRouter.post("/", validate({ body: createAddressSchema }), asyncHandler(controller.create));
addressesRouter.patch("/:id", validate({ body: updateAddressSchema }), asyncHandler(controller.update));
addressesRouter.delete("/:id", asyncHandler(controller.remove));
addressesRouter.post("/:id/default", asyncHandler(controller.setDefault));
