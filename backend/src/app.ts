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

  // Supports multiple allowed origins (comma-separated in CORS_ORIGIN) — a
  // single fixed string here previously broke every API call for anyone
  // reaching the site via a URL variant not in that one string (e.g.
  // www.mycarekart.com when only the bare domain was configured), since
  // "cors" echoes the configured value verbatim and the browser rejects a
  // mismatch against the page's real origin.
  const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(
    cors({
      // Declining with `callback(null, false)` — never `callback(err)` — for
      // an origin outside the allowlist: that just omits the CORS headers,
      // which is all that's needed to stop a disallowed page's fetch/XHR
      // from reading the response. Passing an Error instead makes the "cors"
      // middleware call next(err) and abort the request before it ever
      // reaches the route handler — which broke Google's OAuth redirect
      // callback, a legitimate cross-origin POST from accounts.google.com
      // that's a plain form-style navigation, not a fetch/XHR needing CORS
      // read permission at all, and has nothing to do with this allowlist.
      origin(requestOrigin, callback) {
        callback(null, !requestOrigin || allowedOrigins.includes(requestOrigin));
      },
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(pinoHttp({ logger }));

  app.use(env.API_BASE_PATH, globalApiLimiter, apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
