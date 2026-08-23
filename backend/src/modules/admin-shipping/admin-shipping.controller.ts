import type { Request, Response } from "express";
import * as service from "./admin-shipping.service";
import { parseIdParam } from "../../lib/parseId";

export async function list(_req: Request, res: Response) {
  res.json(await service.listBoxSizes());
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await service.createBoxSize(req.body));
}

export async function update(req: Request, res: Response) {
  res.json(await service.updateBoxSize(parseIdParam(req.params.id), req.body));
}

export async function remove(req: Request, res: Response) {
  await service.deleteBoxSize(parseIdParam(req.params.id));
  res.status(204).send();
}
