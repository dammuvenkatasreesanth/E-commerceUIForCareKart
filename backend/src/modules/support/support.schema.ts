import { z } from "zod";

export const createTicketSchema = z.object({
  subject: z.string().min(1).max(200),
  description: z.string().min(1).max(4000),
  orderId: z.number().int().positive().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

export const addTicketNoteSchema = z.object({
  note: z.string().min(1).max(2000),
  isInternal: z.boolean().default(false),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
  assignToSelf: z.boolean().default(false),
});

export const listTicketsQuerySchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
