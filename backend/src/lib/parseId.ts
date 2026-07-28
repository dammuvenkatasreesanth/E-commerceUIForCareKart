import { BadRequestError } from "./errors";

export function parseIdParam(value: string, label = "id"): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError(`Invalid ${label}`);
  }
  return id;
}
