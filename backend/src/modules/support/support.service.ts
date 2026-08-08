import { alias } from "drizzle-orm/mysql-core";
import { asc, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { orders, supportTickets, ticketNotes, users, type TICKET_STATUS, type TICKET_PRIORITY } from "../../db/schema";
import { ForbiddenError, NotFoundError } from "../../lib/errors";
import { buildTicketNumber } from "../../lib/ticketNumber";
import { indexBy } from "../../lib/batchLoad";

type TicketStatus = (typeof TICKET_STATUS)[number];
type TicketPriority = (typeof TICKET_PRIORITY)[number];
type TicketRow = typeof supportTickets.$inferSelect;

const assignedUsers = alias(users, "assignedUsers");

// MariaDB (production) doesn't support the LEFT JOIN LATERAL SQL Drizzle's
// relational with: API generates, so "one" relations (user, assignedTo) use a
// plain self-joined-twice SELECT and the "many" relation (notes) is batched
// separately with a WHERE IN, same pattern as orders/catalog.
async function withUserAndAssignee(rows: TicketRow[]) {
  if (rows.length === 0) return [];
  const userIds = [...new Set(rows.flatMap((r) => [r.userId, r.assignedToId]).filter((id): id is number => id != null))];
  const userRows =
    userIds.length > 0
      ? await db.select({ id: users.id, name: users.name, phone: users.phone, email: users.email }).from(users).where(inArray(users.id, userIds))
      : [];
  const userById = indexBy(userRows, (u) => u.id);

  return rows.map((r) => {
    const assignee = r.assignedToId != null ? userById.get(r.assignedToId) : undefined;
    return {
      ...r,
      user: userById.get(r.userId) ?? null,
      assignedTo: assignee ? { id: assignee.id, name: assignee.name } : null,
    };
  });
}

async function withNotes(rows: Awaited<ReturnType<typeof withUserAndAssignee>>) {
  if (rows.length === 0) return [];
  const notes = await db.select().from(ticketNotes).where(inArray(ticketNotes.ticketId, rows.map((r) => r.id))).orderBy(asc(ticketNotes.createdAt));
  const notesByTicket = new Map<number, typeof notes>();
  for (const note of notes) {
    const list = notesByTicket.get(note.ticketId);
    if (list) list.push(note);
    else notesByTicket.set(note.ticketId, [note]);
  }
  return rows.map((r) => ({ ...r, notes: notesByTicket.get(r.id) ?? [] }));
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
  const row = await db.query.supportTickets.findFirst({ where: eq(supportTickets.id, id) });
  if (!row) throw new NotFoundError("Ticket not found");
  if (row.userId !== userId) throw new ForbiddenError("This ticket does not belong to you");

  const [withRelations] = await withNotes(await withUserAndAssignee([row]));
  return withRelations;
}

// ── Staff (Employee/Admin) access ───────────────────────────────────────

export async function listAllTickets(query: { status?: TicketStatus; page: number; limit: number }) {
  const where = query.status ? eq(supportTickets.status, query.status) : undefined;

  const [rows, [{ value: total }]] = await Promise.all([
    db
      .select({
        ticket: supportTickets,
        userName: users.name,
        userPhone: users.phone,
        assignedName: assignedUsers.name,
      })
      .from(supportTickets)
      .leftJoin(users, eq(supportTickets.userId, users.id))
      .leftJoin(assignedUsers, eq(supportTickets.assignedToId, assignedUsers.id))
      .where(where)
      .orderBy(desc(supportTickets.createdAt))
      .limit(query.limit)
      .offset((query.page - 1) * query.limit),
    db.select({ value: count() }).from(supportTickets).where(where),
  ]);

  const items = rows.map((r) => ({
    ...r.ticket,
    user: { name: r.userName, phone: r.userPhone },
    assignedTo: r.assignedName != null ? { name: r.assignedName } : null,
  }));

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getTicketAny(id: number) {
  const row = await db.query.supportTickets.findFirst({ where: eq(supportTickets.id, id) });
  if (!row) throw new NotFoundError("Ticket not found");

  const [withRelations] = await withNotes(await withUserAndAssignee([row]));
  return withRelations;
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
