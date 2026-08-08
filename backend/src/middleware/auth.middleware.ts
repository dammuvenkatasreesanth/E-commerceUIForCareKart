import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { verifyAccessToken } from "../lib/jwt";
import { UnauthorizedError, ForbiddenError } from "../lib/errors";
import { db } from "../db";
import { users, type ROLE } from "../db/schema";

type Role = (typeof ROLE)[number];

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: Role };
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new UnauthorizedError("Missing bearer token");
    }
    const token = header.slice("Bearer ".length);
    const payload = verifyAccessToken(token);

    const user = await db.query.users.findFirst({ where: eq(users.id, payload.sub) });
    if (!user) throw new UnauthorizedError("User no longer exists");
    if (user.status === "BLOCKED" || user.status === "SUSPENDED") {
      throw new ForbiddenError("Account is blocked or suspended");
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
      next(err);
    } else {
      next(new UnauthorizedError("Invalid or expired token"));
    }
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError("You do not have permission to perform this action"));
      return;
    }
    next();
  };
}
