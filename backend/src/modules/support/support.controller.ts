import type { Request, Response } from "express";
import * as service from "./support.service";
import { UnauthorizedError } from "../../lib/errors";
import { parseIdParam } from "../../lib/parseId";

export async function create(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  res.status(201).json(await service.createTicket(req.user.id, req.body));
}

export async function listMine(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  res.json(await service.listTicketsForUser(req.user.id));
}

export async function getMine(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const id = parseIdParam(req.params.id, "ticket id");
  res.json(await service.getTicketForUser(req.user.id, id));
}
