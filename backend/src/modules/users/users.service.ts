import { and, eq, ne } from "drizzle-orm";
import { db } from "../../db";
import { users, type ACCOUNT_TYPE } from "../../db/schema";
import { NotFoundError, ConflictError } from "../../lib/errors";
import { sendVerificationEmail } from "../auth/auth.service";

export async function getProfile(userId: number) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) throw new NotFoundError("User not found");
  return user;
}

interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  accountType?: (typeof ACCOUNT_TYPE)[number];
  gstin?: string;
}

export async function updateProfile(userId: number, input: UpdateProfileInput) {
  const current = await db.query.users.findFirst({ where: eq(users.id, userId) });
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

    const existing = await db.query.users.findFirst({ where: and(eq(users.email, input.email!), ne(users.id, userId)) });
    if (existing) throw new ConflictError("This email is already in use.");
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

  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, userId));
  const updated = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!updated) throw new NotFoundError("User not found");

  if (emailChanged && updated.email) {
    await sendVerificationEmail(updated.id, updated.email, updated.name ?? "");
  }

  return updated;
}
