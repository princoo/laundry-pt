import { prisma } from '@/lib/prisma'
import { ACTIVE_STATUSES } from '@/services/assignment.service'
import { getAlertLevel, type AlertLevel } from '@/lib/utils/sla'
import type { AlertEventLevel } from '@prisma/client'

type Key = Exclude<AlertLevel, null>

const DB_LEVEL: Record<Key, AlertEventLevel> = {
  pickup_overdue: 'PICKUP_OVERDUE',
  return_overdue: 'RETURN_OVERDUE',
  at_risk: 'AT_RISK',
  deadline_missed: 'DEADLINE_MISSED',
}

const FROM_DB_LEVEL: Record<AlertEventLevel, Key> = {
  PICKUP_OVERDUE: 'pickup_overdue',
  RETURN_OVERDUE: 'return_overdue',
  AT_RISK: 'at_risk',
  DEADLINE_MISSED: 'deadline_missed',
}

// Scans active requests for alert conditions and records each (request, level)
// pair the first time it's detected — a frozen fact even after the request closes.
export async function recordDetectedAlerts(): Promise<void> {
  const active = await prisma.request.findMany({
    where: { status: { in: ACTIVE_STATUSES } },
    select: {
      id: true, status: true, serviceType: true, isExpress: true,
      createdAt: true, completedAt: true,
    },
  })

  const events = active
    .map((r) => ({ requestId: r.id, level: getAlertLevel(r) }))
    .filter((e): e is { requestId: string; level: Key } => e.level !== null)
    .map((e) => ({ requestId: e.requestId, level: DB_LEVEL[e.level] }))

  if (events.length > 0) {
    await prisma.requestAlertEvent.createMany({ data: events, skipDuplicates: true })
  }
}

export async function getAlertEventsForRequest(requestId: string) {
  const rows = await prisma.requestAlertEvent.findMany({
    where: { requestId },
    orderBy: { detectedAt: 'asc' },
  })
  return rows.map((row) => ({ level: FROM_DB_LEVEL[row.level], detectedAt: row.detectedAt }))
}
