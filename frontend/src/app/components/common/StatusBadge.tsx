const COLOR_MAP: Record<string, string> = {
  // Order status
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-blue-50 text-blue-700",
  PACKED: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  OUT_FOR_DELIVERY: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
  RETURN_REQUESTED: "bg-amber-50 text-amber-700",
  RETURNED: "bg-muted text-muted-foreground",
  // Payment status
  PAID: "bg-emerald-50 text-emerald-700",
  FAILED: "bg-red-50 text-red-700",
  REFUNDED: "bg-muted text-muted-foreground",
  PARTIALLY_REFUNDED: "bg-amber-50 text-amber-700",
  // Staff / customer status
  ACTIVE: "bg-emerald-50 text-emerald-700",
  BLOCKED: "bg-red-50 text-red-700",
  SUSPENDED: "bg-amber-50 text-amber-700",
  // GST status
  NONE: "bg-muted text-muted-foreground",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
  // Return status (remainder not already covered above)
  REQUESTED: "bg-amber-50 text-amber-700",
  PICKUP_SCHEDULED: "bg-blue-50 text-blue-700",
  RECEIVED: "bg-indigo-50 text-indigo-700",
  INSPECTED: "bg-indigo-50 text-indigo-700",
  RESTOCKED: "bg-emerald-50 text-emerald-700",
  WRITTEN_OFF: "bg-red-50 text-red-700",
  // Stock movement type
  RECEIPT: "bg-emerald-50 text-emerald-700",
  DAMAGE: "bg-red-50 text-red-700",
  LOSS: "bg-red-50 text-red-700",
  RESERVE: "bg-amber-50 text-amber-700",
  RELEASE: "bg-blue-50 text-blue-700",
  DEDUCT: "bg-amber-50 text-amber-700",
  RETURN_RESTOCK: "bg-emerald-50 text-emerald-700",
  WRITE_OFF: "bg-red-50 text-red-700",
  ADJUSTMENT: "bg-blue-50 text-blue-700",
  // Ticket status
  OPEN: "bg-amber-50 text-amber-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  RESOLVED: "bg-emerald-50 text-emerald-700",
  CLOSED: "bg-muted text-muted-foreground",
  // Ticket priority
  LOW: "bg-muted text-muted-foreground",
  MEDIUM: "bg-blue-50 text-blue-700",
  HIGH: "bg-red-50 text-red-700",
};

const LABEL_MAP: Record<string, string> = {
  OUT_FOR_DELIVERY: "Out for Delivery",
  RETURN_REQUESTED: "Return Requested",
  PARTIALLY_REFUNDED: "Partially Refunded",
  PICKUP_SCHEDULED: "Pickup Scheduled",
  WRITTEN_OFF: "Written Off",
  RETURN_RESTOCK: "Return Restock",
  WRITE_OFF: "Write Off",
  IN_PROGRESS: "In Progress",
};

function humanize(value: string): string {
  return LABEL_MAP[value] ?? value.charAt(0) + value.slice(1).toLowerCase();
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${COLOR_MAP[status] ?? "bg-muted text-muted-foreground"}`}>{humanize(status)}</span>;
}
