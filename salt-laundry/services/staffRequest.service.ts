import { prisma } from '@/lib/prisma'
import { STATUS_TRANSITIONS } from '@/lib/constants/statuses'
import { formatReference } from '@/lib/utils/formatting'
import type { RequestStatus } from '@prisma/client'

export class InvalidStatusTransitionError extends Error {}

export const ITEM_DETAIL_SELECT = {
  id: true,
  quantity: true,
  unitPrice: true,
  subtotal: true,
  laundryItem: { select: { nameEn: true, nameFr: true } },
} as const

interface QueueParams {
  status?: RequestStatus
  page: number
  limit: number
}

export async function getRequestsQueue({ status, page, limit }: QueueParams) {
  const where = status ? { status } : {}

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

export async function getRequestById(id: string) {
  return prisma.request.findUnique({
    where: { id },
    include: { items: { select: ITEM_DETAIL_SELECT } },
  })
}

export async function updateRequestStatus(id: string, nextStatus: RequestStatus) {
  const existing = await prisma.request.findUnique({ where: { id } })
  if (!existing) return null

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
