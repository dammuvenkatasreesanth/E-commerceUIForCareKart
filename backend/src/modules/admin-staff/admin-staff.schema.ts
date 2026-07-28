import { z } from "zod";

const staffRole = z.enum(["ADMIN", "EMPLOYEE"]);

export const createStaffSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  role: staffRole,
});

export const updateStaffRoleSchema = z.object({
  role: staffRole,
});

export const updateStaffStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BLOCKED", "SUSPENDED"]),
});

export const auditLogQuerySchema = z.object({
  actorId: z.coerce.number().int().positive().optional(),
  entityType: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});
