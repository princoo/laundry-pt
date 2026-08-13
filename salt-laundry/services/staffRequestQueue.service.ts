import { prisma } from '@/lib/prisma'
import { formatReference } from '@/lib/utils/formatting'
import { DEFAULT_SORT, type SortOrder } from '@/lib/constants/queue'
import { hasPermission } from '@/lib/utils/permissions'
import type { RequestStatus } from '@prisma/client'

interface QueueParams {
  status?: RequestStatus
  page: number
  limit: number
  sort?: SortOrder
  actorId?: string
  actorPermissions?: readonly string[]
  assignedToFilter?: string
  flagged?: boolean
}

export async function getRequestsQueue({
  status, page, limit, sort = DEFAULT_SORT, actorId, actorPermissions, assignedToFilter, flagged,
}: QueueParams) {
  const where: Record<string, unknown> = status ? { status } : {}
  // Without LAUNDRY_REQUESTS_VIEW_ALL an actor only ever sees their own tasks.
  // The empty-string fallback matches nothing rather than falling through to all rows.
  if (!hasPermission(actorPermissions, 'LAUNDRY_REQUESTS_VIEW_ALL')) {
    where.assignedToId = actorId ?? ''
  } else if (assignedToFilter) {
    where.assignedToId = assignedToFilter
  }
  // Narrows to requests returned for changes, on top of any status/assignee
  // filter- the flag is independent of where the request sits in the lifecycle.
  if (flagged) where.needsChanges = true

  const [rows, total] = await Promise.all([
    prisma.request.findMany({
      where,
      orderBy: { createdAt: sort },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, seq: true, roomNumber: true, guestName: true,
        isExpress: true, status: true, totalAmount: true,
        needsChanges: true,
        createdAt: true, updatedAt: true, collectedAt: true,
        completedAt: true, returnedAt: true,
        assignedAt: true,
        assignedTo: { select: { id: true, name: true } },
        items: {
          select: { quantity: true, serviceType: true, laundryItem: { select: { nameEn: true } } },
        },
      },
    }),
    prisma.request.count({ where }),
  ])

  const requests = rows.map(({ items, seq, createdAt, ...rest }) => ({
    ...rest,
    createdAt, reference: formatReference(seq, createdAt),
    serviceTypes: [...new Set(items.map((item) => item.serviceType))],
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    itemNames: items.map((item) => item.laundryItem.nameEn),
  }))

  return { requests, total }
}
