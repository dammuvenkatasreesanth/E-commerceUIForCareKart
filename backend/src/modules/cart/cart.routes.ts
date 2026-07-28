import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { addCartItemSchema, updateCartItemSchema, quoteCartSchema } from "./cart.schema";
import * as controller from "./cart.controller";

export const cartRouter = Router();

// Public — no auth — must stay registered before the `authenticate` gate below.
// Backs the guest (logged-out) cart: re-prices a client-held cart server-side.
cartRouter.post("/quote", validate({ body: quoteCartSchema }), asyncHandler(controller.quoteCart));

cartRouter.use(authenticate);

cartRouter.get("/", asyncHandler(controller.getCart));
cartRouter.post("/items", validate({ body: addCartItemSchema }), asyncHandler(controller.addItem));
cartRouter.patch("/items/:id", validate({ body: updateCartItemSchema }), asyncHandler(controller.updateItem));
cartRouter.delete("/items/:id", asyncHandler(controller.removeItem));
cartRouter.delete("/", asyncHandler(controller.clearCart));
