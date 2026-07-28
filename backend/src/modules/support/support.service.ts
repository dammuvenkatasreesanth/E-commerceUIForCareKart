import { prisma } from "../../lib/prisma";
import { ForbiddenError, NotFoundError } from "../../lib/errors";
import { buildTicketNumber } from "../../lib/ticketNumber";
import type { TicketStatus, TicketPriority } from "@prisma/client";

const ticketInclude = {
  notes: { orderBy: { createdAt: "asc" as const } },
  user: { select: { id: true, name: true, phone: true, email: true } },
  assignedTo: { select: { id: true, name: true } },
};

export async function createTicket(userId: number, input: { subject: string; description: string; orderId?: number; priority: TicketPriority }) {
  if (input.orderId) {
    const order = await prisma.order.findUnique({ where: { id: input.orderId } });
    if (!order || order.userId !== userId) throw new ForbiddenError("Invalid order reference");
  }

  const ticket = await prisma.supportTicket.create({
    data: {
      ticketNumber: `PENDING-${userId}-${Date.now()}`,
      userId,
      orderId: input.orderId,
      subject: input.subject,
      description: input.description,
      priority: input.priority,
      status: "OPEN",
    },
  });

  return prisma.supportTicket.update({ where: { id: ticket.id }, data: { ticketNumber: buildTicketNumber(ticket.id) } });
}

export async function listTicketsForUser(userId: number) {
  return prisma.supportTicket.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getTicketForUser(userId: number, id: number) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id }, include: ticketInclude });
  if (!ticket) throw new NotFoundError("Ticket not found");
  if (ticket.userId !== userId) throw new ForbiddenError("This ticket does not belong to you");
  return ticket;
}

// ── Staff (Employee/Admin) access ───────────────────────────────────────

export async function listAllTickets(query: { status?: TicketStatus; page: number; limit: number }) {
  const where = query.status ? { status: query.status } : {};
  const [items, total] = await prisma.$transaction([
    prisma.supportTicket.findMany({
      where,
      include: { user: { select: { name: true, phone: true } }, assignedTo: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.supportTicket.count({ where }),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getTicketAny(id: number) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id }, include: ticketInclude });
  if (!ticket) throw new NotFoundError("Ticket not found");
  return ticket;
}

export async function addNote(ticketId: number, authorId: number, note: string, isInternal: boolean) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw new NotFoundError("Ticket not found");
  return prisma.ticketNote.create({ data: { ticketId, authorId, note, isInternal } });
}

export async function updateTicketStatus(ticketId: number, actorId: number, status: TicketStatus, assignToSelf: boolean) {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw new NotFoundError("Ticket not found");
  return prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status, assignedToId: assignToSelf ? actorId : ticket.assignedToId },
  });
}
