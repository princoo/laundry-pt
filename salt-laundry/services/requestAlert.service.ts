import { prisma } from '@/lib/prisma'
import { ACTIVE_STATUSES } from '@/services/assignment.service'
import { getAlertLevel, type AlertLevel } from '@/lib/utils/sla'
import { uniqueServiceTypes } from '@/lib/utils/serviceSummary'
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

// Alert level is derived from timestamps at read time rather than stored, so
// every count or sweep starts from the same scan. `where` narrows the scope —
// a housekeeper's own tasks rather than the whole hotel.
export async function scanActiveAlerts(where: object = {}) {
  const active = await prisma.request.findMany({
    where: { ...where, status: { in: ACTIVE_STATUSES } },
    select: {
      id: true, status: true, isExpress: true,
      createdAt: true, completedAt: true,
      items: { select: { serviceType: true } },
    },
  })

  return active.map(({ items, ...r }) => ({
    requestId: r.id,
    level: getAlertLevel({ ...r, serviceTypes: uniqueServiceTypes(items) }),
  }))
}

// Counts across every active request, not just the page on screen — the whole
// point of the dashboard tile.
export async function countActiveAlerts(where: object = {}): Promise<number> {
  const scanned = await scanActiveAlerts(where)
  return scanned.filter((alert) => alert.level !== null).length
}

// Records each (request, level) pair the first time it's detected — a frozen
// fact even after the request closes.
export async function recordDetectedAlerts(): Promise<void> {
  const events = (await scanActiveAlerts())
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
