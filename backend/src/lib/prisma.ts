import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const basePrisma =
  global.__prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.__prisma = basePrisma;
}

// Hostinger's shared hosting throttles CPU (CloudLinux LVE), which
// periodically freezes the process long enough to corrupt the query engine's
// internal Tokio timer, surfacing as "PANIC: timer has gone away" on
// whichever query happens to run next. Prisma's client visibly recovers on
// its own within the same process (each panic is followed by "library
// starting" in the debug log) — retrying transparently here turns that into
// a few hundred ms of added latency instead of a 500 reaching the user.
const RETRYABLE_ERROR = /PANIC|timer has gone away/i;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 300;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const prisma = basePrisma.$extends({
  query: {
    async $allOperations({ args, query }) {
      for (let attempt = 1; ; attempt++) {
        try {
          return await query(args);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          if (attempt >= MAX_ATTEMPTS || !RETRYABLE_ERROR.test(message)) throw err;
          await sleep(RETRY_DELAY_MS * attempt);
        }
      }
    },
  },
});
