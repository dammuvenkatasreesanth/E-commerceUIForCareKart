import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { updateProfileSchema } from "./users.schema";
import * as controller from "./users.controller";
import { addressesRouter } from "../addresses/addresses.routes";

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get("/me", asyncHandler(controller.getMe));
usersRouter.patch("/me", validate({ body: updateProfileSchema }), asyncHandler(controller.updateMe));

usersRouter.use("/me/addresses", addressesRouter);
