import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { listCustomersQuerySchema } from "../admin-customers/admin-customers.schema";
import { listOrdersQuerySchema } from "../admin-orders/admin-orders.schema";
import { listTicketsQuerySchema, addTicketNoteSchema, updateTicketStatusSchema } from "../support/support.schema";
import { addOrderNoteSchema, employeeCancelOrderSchema, employeeReturnOrderSchema } from "./employee.schema";
import * as controller from "./employee.controller";

export const employeeRouter = Router();

employeeRouter.use(authenticate, requireRole("EMPLOYEE"));

// Customers — read-only
employeeRouter.get("/customers", validate({ query: listCustomersQuerySchema }), asyncHandler(controller.listCustomers));
employeeRouter.get("/customers/:id", asyncHandler(controller.getCustomer));

// Orders — read + narrow write (no pricing/catalog access)
employeeRouter.get("/orders", validate({ query: listOrdersQuerySchema }), asyncHandler(controller.listOrders));
employeeRouter.get("/orders/:id", asyncHandler(controller.getOrder));
employeeRouter.post("/orders/:id/notes", validate({ body: addOrderNoteSchema }), asyncHandler(controller.addOrderNote));
employeeRouter.patch("/orders/:id/cancel", validate({ body: employeeCancelOrderSchema }), asyncHandler(controller.cancelOrder));
employeeRouter.post("/orders/:id/return", validate({ body: employeeReturnOrderSchema }), asyncHandler(controller.returnOrder));

// Support tickets
employeeRouter.get("/tickets", validate({ query: listTicketsQuerySchema }), asyncHandler(controller.listTickets));
employeeRouter.get("/tickets/:id", asyncHandler(controller.getTicket));
employeeRouter.post("/tickets/:id/notes", validate({ body: addTicketNoteSchema }), asyncHandler(controller.addTicketNote));
employeeRouter.patch("/tickets/:id/status", validate({ body: updateTicketStatusSchema }), asyncHandler(controller.updateTicketStatus));
