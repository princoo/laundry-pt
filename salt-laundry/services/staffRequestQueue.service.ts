import { prisma } from '@/lib/prisma'
import { formatReference } from '@/lib/utils/formatting'
import type { RequestStatus, Role } from '@prisma/client'

interface QueueParams {
  status?: RequestStatus
  page: number
  limit: number
  actorId?: string
  actorRole?: Role
  viewAll?: boolean
  assignedToFilter?: string
}

export async function getRequestsQueue({
  status, page, limit, actorId, actorRole, viewAll, assignedToFilter,
}: QueueParams) {
  const where: Record<string, unknown> = status ? { status } : {}
  if (actorRole === 'HOUSEKEEPER' && !viewAll && actorId) {
    where.assignedToId = actorId
  } else if (actorRole !== 'HOUSEKEEPER' && assignedToFilter) {
    where.assignedToId = assignedToFilter
  }

  const [rows, total] = await Promise.all([
    prisma.request.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, seq: true, roomNumber: true, guestName: true, serviceType: true,
        isExpress: true, status: true, totalAmount: true,
        createdAt: true, updatedAt: true, collectedAt: true,
        completedAt: true, returnedAt: true,
        assignedAt: true, acknowledgedAt: true,
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
