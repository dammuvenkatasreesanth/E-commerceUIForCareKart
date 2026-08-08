import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "../config/env";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __dbPool: mysql.Pool | undefined;
}

// A plain mysql2 pool + JS query builder — no native/Rust runtime, so it
// can't hit the "PANIC: timer has gone away" failure Prisma's Rust query
// engine suffers under Hostinger's CPU-throttled shared hosting. A frozen
// process just resumes with the connection intact (or cleanly reconnects on
// a lost connection); there's no separate runtime state to corrupt.
const pool =
  global.__dbPool ??
  mysql.createPool({
    uri: env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
  });

if (env.NODE_ENV !== "production") {
  global.__dbPool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
export const dbPool = pool;
