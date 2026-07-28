import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

interface AuditParams {
  actorId?: number | null;
  action: string;
  entityType: string;
  entityId?: number | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
}

export async function writeAudit(params: AuditParams): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorId: params.actorId ?? null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      metadata: (params.metadata as Prisma.InputJsonValue) ?? undefined,
      ipAddress: params.ipAddress ?? null,
    },
  });
}
