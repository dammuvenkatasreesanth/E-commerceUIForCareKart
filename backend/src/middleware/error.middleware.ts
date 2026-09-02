import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";
import { AppError } from "../lib/errors";
import { logger } from "../lib/logger";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.originalUrl}` } });
}

const MULTER_MESSAGES: Partial<Record<MulterError["code"], string>> = {
  LIMIT_FILE_SIZE: "That file is too large.",
  LIMIT_UNEXPECTED_FILE: "Unexpected file field.",
};

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: { message: "Validation failed", details: err.flatten() },
    });
    return;
  }

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err }, err.message);
    }
    res.status(err.statusCode).json({ error: { message: err.message, details: err.details } });
    return;
  }

  // Multer surfaces both its own typed errors (file too large, too many
  // files, ...) and whatever plain Error a fileFilter callback throws (e.g.
  // "Only video files are allowed") as a generic Error, not an AppError —
  // without this, every upload rejection fell through to a bare "Internal
  // server error" that gave the admin no idea what actually went wrong.
  if (err instanceof MulterError) {
    res.status(400).json({ error: { message: MULTER_MESSAGES[err.code] ?? err.message } });
    return;
  }
  if (err instanceof Error && req.headers["content-type"]?.includes("multipart/form-data")) {
    res.status(400).json({ error: { message: err.message } });
    return;
  }

  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: { message: "Internal server error" } });
}
