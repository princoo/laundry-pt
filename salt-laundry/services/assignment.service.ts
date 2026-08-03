import { prisma } from '@/lib/prisma'
import type { RequestStatus } from '@prisma/client'

export const ACTIVE_STATUSES: RequestStatus[] = ['PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY']

// Picks the least-busy available housekeeper, breaking ties at random.
// Runs once, when the request is created — an assignment is never taken back
// automatically after that; only a supervisor can move it.
export async function autoAssign(requestId: string): Promise<string | null> {
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
  const selected = tied[Math.floor(Math.random() * tied.length)]

  await prisma.request.update({
    where: { id: requestId },
    data: { assignedToId: selected.id, assignedAt: new Date(), assignmentMethod: 'AUTO' },
  })
  return selected.id
}

// Supervisor manually reassigns a request to a specific housekeeper — the only
// way a task ever leaves its current holder. Notifies the previous assignee
// (if any, and if different) that the task is no longer theirs.
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
      assignmentMethod: 'MANUAL',
      ...(wasReassignedAway && { unassignedFromId: previousAssigneeId, unassignedAt: new Date() }),
    },
  })
}
