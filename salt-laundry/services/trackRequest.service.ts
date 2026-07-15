import { prisma } from '@/lib/prisma'
import { TRACKABLE_STATUSES } from '@/lib/constants/statuses'
import { ITEM_DETAIL_SELECT } from '@/services/staffRequest.service'

export async function getRequestByRoomAndReference(roomNumber: string, seq: number) {
  return prisma.request.findFirst({
    where: { roomNumber: { equals: roomNumber, mode: 'insensitive' }, seq },
    include: { items: { select: ITEM_DETAIL_SELECT } },
  })
}

export async function getTrackableRequestsByRoom(roomNumber: string) {
  return prisma.request.findMany({
    where: {
      roomNumber: { equals: roomNumber, mode: 'insensitive' },
      status: { in: TRACKABLE_STATUSES },
    },
    include: { items: { select: ITEM_DETAIL_SELECT } },
    orderBy: { createdAt: 'desc' },
  })
}
