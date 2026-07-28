import type { Request, Response } from "express";
import * as adminOrdersService from "../admin-orders/admin-orders.service";
import * as adminCustomersService from "../admin-customers/admin-customers.service";
import * as ordersService from "../orders/orders.service";
import * as supportService from "../support/support.service";
import { parseIdParam } from "../../lib/parseId";

// Customers (read-only)
export async function listCustomers(req: Request, res: Response) {
  res.json(await adminCustomersService.listCustomers(req.query as unknown as Parameters<typeof adminCustomersService.listCustomers>[0]));
}
export async function getCustomer(req: Request, res: Response) {
  res.json(await adminCustomersService.getCustomer(parseIdParam(req.params.id)));
}

// Orders (read + narrow write)
export async function listOrders(req: Request, res: Response) {
  res.json(await adminOrdersService.listOrders(req.query as unknown as Parameters<typeof adminOrdersService.listOrders>[0]));
}
export async function getOrder(req: Request, res: Response) {
  res.json(await adminOrdersService.getOrder(parseIdParam(req.params.id)));
}
export async function addOrderNote(req: Request, res: Response) {
  const id = parseIdParam(req.params.id, "order id");
  res.status(201).json(await ordersService.addOrderNote(req.user!, id, req.body.note, req.body.isInternal));
}
export async function cancelOrder(req: Request, res: Response) {
  const id = parseIdParam(req.params.id, "order id");
  res.json(await ordersService.cancelOrder(req.user!, id, req.body.reason));
}
export async function returnOrder(req: Request, res: Response) {
  const id = parseIdParam(req.params.id, "order id");
  res.status(201).json(await ordersService.requestReturn(req.user!, id, req.body));
}

// Tickets
export async function listTickets(req: Request, res: Response) {
  res.json(await supportService.listAllTickets(req.query as unknown as Parameters<typeof supportService.listAllTickets>[0]));
}
export async function getTicket(req: Request, res: Response) {
  res.json(await supportService.getTicketAny(parseIdParam(req.params.id, "ticket id")));
}
export async function addTicketNote(req: Request, res: Response) {
  const id = parseIdParam(req.params.id, "ticket id");
  res.status(201).json(await supportService.addNote(id, req.user!.id, req.body.note, req.body.isInternal));
}
export async function updateTicketStatus(req: Request, res: Response) {
  const id = parseIdParam(req.params.id, "ticket id");
  res.json(await supportService.updateTicketStatus(id, req.user!.id, req.body.status, req.body.assignToSelf));
}
