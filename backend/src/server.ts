import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { dbPool } from "./db";
import { sweepStalePayments } from "./modules/payments/payments.service";

const app = createApp();

const server = app.listen(env.PORT, "0.0.0.0", () => {
  logger.info(`CareKart API listening on port ${env.PORT} (${env.NODE_ENV})`);
});

const PAYMENT_SWEEP_INTERVAL_MS = 5 * 60 * 1000;
const paymentSweepInterval = setInterval(() => {
  sweepStalePayments().catch((err) => logger.error({ err }, "Payment sweep failed"));
}, PAYMENT_SWEEP_INTERVAL_MS);
paymentSweepInterval.unref();

async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await dbPool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
