import { asc, count, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { orders, supportTickets, ticketNotes, type TICKET_STATUS, type TICKET_PRIORITY } from "../../db/schema";
import { ForbiddenError, NotFoundError } from "../../lib/errors";
import { buildTicketNumber } from "../../lib/ticketNumber";

type TicketStatus = (typeof TICKET_STATUS)[number];
type TicketPriority = (typeof TICKET_PRIORITY)[number];

function ticketWith() {
  return {
    notes: { orderBy: [asc(ticketNotes.createdAt)] },
    user: { columns: { id: true, name: true, phone: true, email: true } },
    assignedTo: { columns: { id: true, name: true } },
  };
}

export async function createTicket(userId: number, input: { subject: string; description: string; orderId?: number; priority: TicketPriority }) {
  if (input.orderId) {
    const order = await db.query.orders.findFirst({ where: eq(orders.id, input.orderId) });
    if (!order || order.userId !== userId) throw new ForbiddenError("Invalid order reference");
  }

  const [{ id }] = await db
    .insert(supportTickets)
    .values({
      ticketNumber: `PENDING-${userId}-${Date.now()}`,
      userId,
      orderId: input.orderId,
      subject: input.subject,
      description: input.description,
      priority: input.priority,
      status: "OPEN",
      updatedAt: new Date(),
    })
    .$returningId();

  await db.update(supportTickets).set({ ticketNumber: buildTicketNumber(id), updatedAt: new Date() }).where(eq(supportTickets.id, id));

  const created = await db.query.supportTickets.findFirst({ where: eq(supportTickets.id, id) });
  if (!created) throw new NotFoundError("Ticket not found");
  return created;
}

export async function listTicketsForUser(userId: number) {
  return db.query.supportTickets.findMany({ where: eq(supportTickets.userId, userId), orderBy: [desc(supportTickets.createdAt)] });
}

export async function getTicketForUser(userId: number, id: number) {
  const ticket = await db.query.supportTickets.findFirst({ where: eq(supportTickets.id, id), with: ticketWith() });
  if (!ticket) throw new NotFoundError("Ticket not found");
  if (ticket.userId !== userId) throw new ForbiddenError("This ticket does not belong to you");
  return ticket;
}

// ── Staff (Employee/Admin) access ───────────────────────────────────────

export async function listAllTickets(query: { status?: TicketStatus; page: number; limit: number }) {
  const where = query.status ? eq(supportTickets.status, query.status) : undefined;

  const [items, [{ value: total }]] = await Promise.all([
    db.query.supportTickets.findMany({
      where,
      with: { user: { columns: { name: true, phone: true } }, assignedTo: { columns: { name: true } } },
      orderBy: [desc(supportTickets.createdAt)],
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    }),
    db.select({ value: count() }).from(supportTickets).where(where),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getTicketAny(id: number) {
  const ticket = await db.query.supportTickets.findFirst({ where: eq(supportTickets.id, id), with: ticketWith() });
  if (!ticket) throw new NotFoundError("Ticket not found");
  return ticket;
}

export async function addNote(ticketId: number, authorId: number, note: string, isInternal: boolean) {
  const ticket = await db.query.supportTickets.findFirst({ where: eq(supportTickets.id, ticketId) });
  if (!ticket) throw new NotFoundError("Ticket not found");
  const [{ id }] = await db.insert(ticketNotes).values({ ticketId, authorId, note, isInternal }).$returningId();
  const created = await db.query.ticketNotes.findFirst({ where: eq(ticketNotes.id, id) });
  if (!created) throw new NotFoundError("Ticket note not found");
  return created;
}

export async function updateTicketStatus(ticketId: number, actorId: number, status: TicketStatus, assignToSelf: boolean) {
  const ticket = await db.query.supportTickets.findFirst({ where: eq(supportTickets.id, ticketId) });
  if (!ticket) throw new NotFoundError("Ticket not found");
  await db
    .update(supportTickets)
    .set({ status, assignedToId: assignToSelf ? actorId : ticket.assignedToId, updatedAt: new Date() })
    .where(eq(supportTickets.id, ticketId));
  const updated = await db.query.supportTickets.findFirst({ where: eq(supportTickets.id, ticketId) });
  if (!updated) throw new NotFoundError("Ticket not found");
  return updated;
}
