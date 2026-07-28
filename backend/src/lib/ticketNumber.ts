export function buildTicketNumber(id: number): string {
  const year = new Date().getFullYear();
  return `TCK-${year}-${id.toString().padStart(5, "0")}`;
}
