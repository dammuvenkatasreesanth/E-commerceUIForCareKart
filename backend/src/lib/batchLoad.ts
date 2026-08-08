// Production's MySQL is actually MariaDB, which doesn't support the LEFT JOIN
// LATERAL SQL that Drizzle's relational query API (`db.query.X.findMany({ with })`)
// generates for MySQL. Every "many"/"one" relation load in this codebase goes
// through plain batched WHERE IN queries instead, grouped here in JS — the same
// N+1-avoidance technique Prisma used internally, just done by hand.
export function groupBy<T, K>(rows: T[], keyFn: (row: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const row of rows) {
    const key = keyFn(row);
    const list = map.get(key);
    if (list) list.push(row);
    else map.set(key, [row]);
  }
  return map;
}

export function indexBy<T, K>(rows: T[], keyFn: (row: T) => K): Map<K, T> {
  const map = new Map<K, T>();
  for (const row of rows) map.set(keyFn(row), row);
  return map;
}
