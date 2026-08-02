import { prisma } from '@/lib/prisma'
import type { Role } from '@prisma/client'

export class ForbiddenAssignmentError extends Error {}
export class AlreadyAcknowledgedError extends Error {}

// Housekeepers may only acknowledge their own assignment; supervisors/admins may acknowledge any.
export async function acknowledgeRequest(requestId: string, actorId: string, actorRole: Role) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    select: { assignedToId: true, acknowledgedAt: true },
  })
  if (!request) return null

  if (actorRole === 'HOUSEKEEPER' && request.assignedToId !== actorId) {
    throw new ForbiddenAssignmentError()
  }
  if (request.acknowledgedAt) throw new AlreadyAcknowledgedError()

  return prisma.request.update({
    where: { id: requestId },
    data: { acknowledgedAt: new Date() },
    select: { acknowledgedAt: true },
  })
}
