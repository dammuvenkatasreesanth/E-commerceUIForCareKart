import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { NotFoundError, ConflictError } from "../../lib/errors";
import { sendVerificationEmail } from "../auth/auth.service";
import type { AccountType } from "@prisma/client";

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("User not found");
  return user;
}

interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  accountType?: AccountType;
  gstin?: string;
}

export async function updateProfile(userId: number, input: UpdateProfileInput) {
  const current = await prisma.user.findUnique({ where: { id: userId } });
  if (!current) throw new NotFoundError("User not found");

  const data: Record<string, unknown> = {
    name: input.name ?? current.name,
    email: input.email ?? current.email,
    phone: input.phone ?? current.phone,
  };

  // Email is now an auth identifier — a silent, unverified change would let
  // someone move their login email to an address they don't control.
  const emailChanged = input.email !== undefined && input.email !== current.email;
  if (emailChanged) {
    data.emailVerified = false;
  }

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

  let updated;
  try {
    updated = await prisma.user.update({ where: { id: userId }, data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new ConflictError("This email is already in use.");
    }
    throw err;
  }

  if (emailChanged && updated.email) {
    await sendVerificationEmail(updated.id, updated.email, updated.name ?? "");
  }

  return updated;
}
