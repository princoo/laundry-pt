import { prisma } from '@/lib/prisma'
import { formatReference } from '@/lib/utils/formatting'
import { DEFAULT_SORT, type SortOrder } from '@/lib/constants/queue'
import type { RequestStatus, Role } from '@prisma/client'

interface QueueParams {
  status?: RequestStatus
  page: number
  limit: number
  sort?: SortOrder
  actorId?: string
  actorRole?: Role
  assignedToFilter?: string
}

export async function getRequestsQueue({
  status, page, limit, sort = DEFAULT_SORT, actorId, actorRole, assignedToFilter,
}: QueueParams) {
  const where: Record<string, unknown> = status ? { status } : {}
  // Housekeepers only ever see their own tasks — there is no all-requests view.
  // The empty-string fallback matches nothing rather than falling through to all rows.
  if (actorRole === 'HOUSEKEEPER') {
    where.assignedToId = actorId ?? ''
  } else if (assignedToFilter) {
    where.assignedToId = assignedToFilter
  }

  const [rows, total] = await Promise.all([
    prisma.request.findMany({
      where,
      orderBy: { createdAt: sort },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, seq: true, roomNumber: true, guestName: true, serviceType: true,
        isExpress: true, status: true, totalAmount: true,
        createdAt: true, updatedAt: true, collectedAt: true,
        completedAt: true, returnedAt: true,
        assignedAt: true,
        assignedTo: { select: { id: true, name: true } },
        items: { select: { quantity: true, laundryItem: { select: { nameEn: true } } } },
      },
    }),
    prisma.request.count({ where }),
  ])

  const requests = rows.map(({ items, seq, createdAt, ...rest }) => ({
    ...rest,
    createdAt, reference: formatReference(seq, createdAt),
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    itemNames: items.map((item) => item.laundryItem.nameEn),
  }))

  return { requests, total }
}
