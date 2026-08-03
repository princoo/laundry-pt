import { prisma } from '@/lib/prisma'
import { STATUS_TRANSITIONS } from '@/lib/constants/statuses'
import { canManageRequest } from '@/lib/utils/requestAccess'
import { ITEM_DETAIL_SELECT } from '@/services/staffRequest.service'
import type { RequestStatus, Role } from '@prisma/client'

export class InvalidStatusTransitionError extends Error {}
export class ForbiddenRequestAccessError extends Error {}

export async function updateRequestStatus(
  id: string,
  nextStatus: RequestStatus,
  actor: { id: string; role: Role }
) {
  const existing = await prisma.request.findUnique({ where: { id } })
  if (!existing) return null

  if (!canManageRequest(existing.assignedToId, actor)) {
    throw new ForbiddenRequestAccessError()
  }

  const allowed =
    nextStatus === 'CANCELLED' || STATUS_TRANSITIONS[existing.status].includes(nextStatus)
  if (!allowed) throw new InvalidStatusTransitionError()

  const timestampField =
    nextStatus === 'COLLECTED' ? 'collectedAt' :
    nextStatus === 'READY' ? 'completedAt' :
    nextStatus === 'DELIVERED' ? 'returnedAt' : null

  return prisma.request.update({
    where: { id },
    data: {
      status: nextStatus,
      ...(timestampField ? { [timestampField]: new Date() } : {}),
    },
    include: { items: { select: ITEM_DETAIL_SELECT } },
  })
}
