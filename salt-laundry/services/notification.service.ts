import { prisma } from '@/lib/prisma'
import { formatReference } from '@/lib/utils/formatting'
import { uniqueServiceTypes } from '@/lib/utils/serviceSummary'
import type { AssignmentMethod, ServiceType } from '@prisma/client'

const NOTIFICATION_SELECT = {
  id: true, seq: true, roomNumber: true, guestName: true,
  isExpress: true, totalAmount: true, createdAt: true,
  items: { select: { serviceType: true } },
}
const ASSIGNED_SELECT = { ...NOTIFICATION_SELECT, assignedAt: true, assignmentMethod: true }

const KIND_BY_METHOD: Record<AssignmentMethod, 'auto_assigned' | 'manual_assigned'> =
  { AUTO: 'auto_assigned', MANUAL: 'manual_assigned' }

// A notification shows the request's distinct services, not its lines.
type AssignedRow = {
  items: { serviceType: ServiceType }[]
  seq: number; createdAt: Date; assignedAt: Date | null; assignmentMethod: AssignmentMethod | null
}

function mapAssigned<T extends AssignedRow>(rows: T[]) {
  return rows.map(({ seq, createdAt, assignedAt, assignmentMethod, items, ...rest }) => ({
    ...rest,
    serviceTypes: uniqueServiceTypes(items),
    kind: KIND_BY_METHOD[assignmentMethod ?? 'AUTO'],
    timestamp: assignedAt!,
    reference: formatReference(seq, createdAt),
  }))
}

export async function getRequestsCreatedSince(since: Date) {
  const rows = await prisma.request.findMany({
    where: { createdAt: { gt: since } },
    orderBy: { createdAt: 'desc' },
    select: NOTIFICATION_SELECT,
  })
  return rows.map(({ seq, createdAt, items, ...rest }) => ({
    ...rest,
    serviceTypes: uniqueServiceTypes(items),
    kind: 'new' as const,
    timestamp: createdAt,
    reference: formatReference(seq, createdAt),
  }))
}

export async function getRequestsAssignedTo(userId: string, since: Date) {
  return mapAssigned(await prisma.request.findMany({
    where: { assignedToId: userId, assignedAt: { gt: since } },
    orderBy: { assignedAt: 'desc' },
    select: ASSIGNED_SELECT,
  }))
}

// Assignments the housekeeper still owes a collection — replayed when a
// notification stream reconnects, so offline-assigned work isn't missed.
export async function getOpenAssignments(userId: string) {
  return mapAssigned(await prisma.request.findMany({
    where: { assignedToId: userId, status: 'PENDING' },
    orderBy: { assignedAt: 'desc' },
    select: ASSIGNED_SELECT,
  }))
}

// Tasks a supervisor has moved to someone else. Informational only, no catch-up.
export async function getUnassignedNotifications(userId: string, since: Date) {
  const rows = await prisma.request.findMany({
    where: { unassignedFromId: userId, unassignedAt: { gt: since } },
    orderBy: { unassignedAt: 'desc' },
    select: { ...NOTIFICATION_SELECT, unassignedAt: true },
  })
  return rows.map(({ seq, createdAt, unassignedAt, items, ...rest }) => ({
    ...rest,
    serviceTypes: uniqueServiceTypes(items),
    kind: 'unassigned' as const,
    timestamp: unassignedAt!,
    reference: formatReference(seq, createdAt),
  }))
}
