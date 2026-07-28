import type { Request, Response } from "express";
import * as addressesService from "./addresses.service";
import { UnauthorizedError } from "../../lib/errors";
import { parseIdParam } from "../../lib/parseId";

export async function list(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const addresses = await addressesService.listAddresses(req.user.id);
  res.json(addresses);
}

export async function create(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const address = await addressesService.createAddress(req.user.id, req.body);
  res.status(201).json(address);
}

export async function update(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const id = parseIdParam(req.params.id, "address id");
  const address = await addressesService.updateAddress(req.user.id, id, req.body);
  res.json(address);
}

export async function remove(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const id = parseIdParam(req.params.id, "address id");
  await addressesService.deleteAddress(req.user.id, id);
  res.status(204).send();
}

export async function setDefault(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const id = parseIdParam(req.params.id, "address id");
  const address = await addressesService.setDefaultAddress(req.user.id, id);
  res.json(address);
}
