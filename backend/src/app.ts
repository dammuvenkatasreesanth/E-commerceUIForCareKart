import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { apiRouter } from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { globalApiLimiter } from "./middleware/rateLimit.middleware";

export function createApp() {
  const app = express();

  // Hostinger (and most PaaS hosts) terminate TLS at a reverse proxy in front of the
  // app — without this, req.ip resolves to the proxy's address and per-IP rate
  // limiting effectively rate-limits everyone as a single client.
  if (env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(pinoHttp({ logger }));

  app.use(env.API_BASE_PATH, globalApiLimiter, apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
