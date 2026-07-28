export function buildOrderNumber(id: number): string {
  const year = new Date().getFullYear();
  return `CK-${year}-${id.toString().padStart(5, "0")}`;
}
