import { prisma } from '@/lib/prisma'
import { formatReference } from '@/lib/utils/formatting'
import type { AssignmentMethod } from '@prisma/client'

const NOTIFICATION_SELECT = {
  id: true, seq: true, roomNumber: true, guestName: true,
  serviceType: true, isExpress: true, totalAmount: true, createdAt: true,
}
const ASSIGNED_SELECT = { ...NOTIFICATION_SELECT, assignedAt: true, assignmentMethod: true }

const KIND_BY_METHOD: Record<AssignmentMethod, 'auto_assigned' | 'manual_assigned'> = {
  AUTO: 'auto_assigned',
  MANUAL: 'manual_assigned',
}

type AssignedRow = {
  seq: number; createdAt: Date; assignedAt: Date | null; assignmentMethod: AssignmentMethod | null
}

function mapAssigned<T extends AssignedRow>(rows: T[]) {
  return rows.map(({ seq, createdAt, assignedAt, assignmentMethod, ...rest }) => ({
    ...rest,
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

  return rows.map(({ seq, createdAt, ...rest }) => ({
    ...rest,
    kind: 'new' as const,
    timestamp: createdAt,
    reference: formatReference(seq, createdAt),
  }))
}

export async function getRequestsAssignedTo(userId: string, since: Date) {
  const rows = await prisma.request.findMany({
    where: { assignedToId: userId, assignedAt: { gt: since } },
    orderBy: { assignedAt: 'desc' },
    select: ASSIGNED_SELECT,
  })
  return mapAssigned(rows)
}

// Assignments the housekeeper hasn't acted on yet — status can't advance past
// PENDING before acknowledgment, so this alone identifies "still owed a look".
export async function getUnacknowledgedAssignments(userId: string) {
  const rows = await prisma.request.findMany({
    where: { assignedToId: userId, acknowledgedAt: null, status: 'PENDING' },
    orderBy: { assignedAt: 'desc' },
    select: ASSIGNED_SELECT,
  })
  return mapAssigned(rows)
}

// Tasks most recently taken from this user — manual reassignment, a missed
// acknowledgment timeout, or an availability toggle. Informational only, no catch-up.
export async function getUnassignedNotifications(userId: string, since: Date) {
  const rows = await prisma.request.findMany({
    where: { unassignedFromId: userId, unassignedAt: { gt: since } },
    orderBy: { unassignedAt: 'desc' },
    select: { ...NOTIFICATION_SELECT, unassignedAt: true },
  })

  return rows.map(({ seq, createdAt, unassignedAt, ...rest }) => ({
    ...rest,
    kind: 'unassigned' as const,
    timestamp: unassignedAt!,
    reference: formatReference(seq, createdAt),
  }))
}
