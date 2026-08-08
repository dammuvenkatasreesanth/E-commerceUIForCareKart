import { db } from "../db";
import { auditLogs } from "../db/schema";

interface AuditParams {
  actorId?: number | null;
  action: string;
  entityType: string;
  entityId?: number | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
}

export async function writeAudit(params: AuditParams): Promise<void> {
  await db.insert(auditLogs).values({
    actorId: params.actorId ?? null,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId ?? null,
    metadata: params.metadata ?? null,
    ipAddress: params.ipAddress ?? null,
  });
}
