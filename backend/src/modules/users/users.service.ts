import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../lib/errors";
import type { AccountType } from "@prisma/client";

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("User not found");
  return user;
}

interface UpdateProfileInput {
  name?: string;
  email?: string;
  accountType?: AccountType;
  gstin?: string;
}

export async function updateProfile(userId: number, input: UpdateProfileInput) {
  const current = await prisma.user.findUnique({ where: { id: userId } });
  if (!current) throw new NotFoundError("User not found");

  const data: Record<string, unknown> = {
    name: input.name ?? current.name,
    email: input.email ?? current.email,
  };

  if (input.accountType === "BUSINESS") {
    data.accountType = "BUSINESS";
    // Re-submitting a different GSTIN (or first submission) requires fresh admin approval.
    if (input.gstin && input.gstin !== current.gstin) {
      data.gstin = input.gstin;
      data.gstStatus = "PENDING";
    }
  } else if (input.accountType === "RETAIL") {
    data.accountType = "RETAIL";
    data.gstin = null;
    data.gstStatus = "NONE";
  }

  return prisma.user.update({ where: { id: userId }, data });
}
