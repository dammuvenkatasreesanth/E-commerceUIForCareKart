export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TicketNote {
  id: number;
  ticketId: number;
  authorId: number;
  isInternal: boolean;
  note: string;
  createdAt: string;
}

export interface SupportTicketListItem {
  id: number;
  ticketNumber: string;
  userId: number;
  orderId: number | null;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedToId: number | null;
  createdAt: string;
  updatedAt: string;
  user: { name: string | null; phone: string | null };
  assignedTo: { name: string | null } | null;
}

export interface SupportTicketDetail extends SupportTicketListItem {
  user: { id: number; name: string | null; phone: string | null; email: string | null };
  assignedTo: { id: number; name: string | null } | null;
  notes: TicketNote[];
}
