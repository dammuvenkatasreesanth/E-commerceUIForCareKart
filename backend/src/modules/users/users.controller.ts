import type { Request, Response } from "express";
import * as usersService from "./users.service";
import { UnauthorizedError } from "../../lib/errors";

function serialize(user: Awaited<ReturnType<typeof usersService.getProfile>>) {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    phone: user.phone,
    email: user.email,
    accountType: user.accountType,
    gstin: user.gstin,
    gstStatus: user.gstStatus,
    createdAt: user.createdAt,
  };
}

export async function getMe(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const user = await usersService.getProfile(req.user.id);
  res.json(serialize(user));
}

export async function updateMe(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const user = await usersService.updateProfile(req.user.id, req.body);
  res.json(serialize(user));
}
