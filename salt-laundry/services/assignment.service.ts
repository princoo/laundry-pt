import { prisma } from '@/lib/prisma'
import type { RequestStatus } from '@prisma/client'

export const ACTIVE_STATUSES: RequestStatus[] = ['PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY']
const TIMEOUT_MS = 10 * 60 * 1000

// Picks the least-busy available housekeeper. If several are tied, picks randomly —
// excluding the previous assignee from that tie-break, unless they're the only option.
export async function autoAssign(requestId: string, excludeUserId?: string): Promise<string | null> {
  const housekeepers = await prisma.user.findMany({
    where: { role: 'HOUSEKEEPER', isActive: true, isAvailable: true },
    include: { _count: { select: { assignedRequests: { where: { status: { in: ACTIVE_STATUSES } } } } } },
  })
  if (housekeepers.length === 0) {
    console.warn(`No available housekeepers for request ${requestId}`)
    return null
  }

  const sorted = housekeepers.sort((a, b) => a._count.assignedRequests - b._count.assignedRequests)
  const minCount = sorted[0]._count.assignedRequests
  const tied = sorted.filter((h) => h._count.assignedRequests === minCount)
  const candidates = excludeUserId && tied.length > 1 ? tied.filter((h) => h.id !== excludeUserId) : tied
  const selected = candidates[Math.floor(Math.random() * candidates.length)]

  await prisma.request.update({
    where: { id: requestId },
    data: { assignedToId: selected.id, assignedAt: new Date(), assignmentMethod: 'AUTO' },
  })
  return selected.id
}

// Supervisor manually reassigns a request to a specific housekeeper. Notifies the
// previous assignee (if any, and if different) that the task is no longer theirs.
export async function manualReassign(requestId: string, newHousekeeperId: string): Promise<void> {
  const current = await prisma.request.findUnique({ where: { id: requestId }, select: { assignedToId: true } })
  if (!current) throw new Error('Request not found')

  const previousAssigneeId = current.assignedToId
  const wasReassignedAway = previousAssigneeId && previousAssigneeId !== newHousekeeperId

  await prisma.request.update({
    where: { id: requestId },
    data: {
      assignedToId: newHousekeeperId,
      assignedAt: new Date(),
      acknowledgedAt: null,
      assignmentMethod: 'MANUAL',
      ...(wasReassignedAway && { unassignedFromId: previousAssigneeId, unassignedAt: new Date() }),
    },
  })
}

// Releases a request from its current holder without a replacement in hand yet
// (timeout, availability toggle) — records who lost it so they can be notified.
export async function releaseAssignment(requestId: string, previousUserId: string): Promise<void> {
  await prisma.request.update({
    where: { id: requestId },
    data: {
      assignedToId: null, assignedAt: null, acknowledgedAt: null,
      unassignedFromId: previousUserId, unassignedAt: new Date(),
    },
  })
}

// Reassigns unacknowledged PENDING requests older than 10 minutes — excluding
// whoever just failed to acknowledge from the next auto-pick.
export async function processTimeouts(): Promise<void> {
  const timedOut = await prisma.request.findMany({
    where: {
      assignedToId: { not: null }, acknowledgedAt: null, status: 'PENDING',
      assignedAt: { lt: new Date(Date.now() - TIMEOUT_MS) },
    },
    select: { id: true, assignedToId: true },
  })
  for (const req of timedOut) {
    if (!req.assignedToId) continue
    await releaseAssignment(req.id, req.assignedToId)
    await autoAssign(req.id, req.assignedToId)
  }
}
