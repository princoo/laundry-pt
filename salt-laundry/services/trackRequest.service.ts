import { prisma } from '@/lib/prisma'
import { TRACKABLE_STATUSES } from '@/lib/constants/statuses'
import { ITEM_DETAIL_SELECT } from '@/services/staffRequest.service'

// These two feed the PUBLIC tracking pages — anyone who knows a room number
// reaches them. They return the whole request row, so every column added to
// Request is served to the public by default. `needsChanges` is deliberately
// left in: the guest has to be told their request needs correcting. The rest of
// the flag is not theirs to see — `flagReason` is free text one staff member
// wrote for another ("count is off by two"), and who flagged it is internal.
const PUBLIC_OMIT = { flagReason: true, flaggedById: true, flaggedAt: true } as const

export async function getRequestByRoomAndReference(roomNumber: string, seq: number) {
  return prisma.request.findFirst({
    where: { roomNumber: { equals: roomNumber, mode: 'insensitive' }, seq },
    omit: PUBLIC_OMIT,
    include: { items: { select: ITEM_DETAIL_SELECT } },
  })
}

export async function getTrackableRequestsByRoom(roomNumber: string) {
  return prisma.request.findMany({
    where: {
      roomNumber: { equals: roomNumber, mode: 'insensitive' },
      status: { in: TRACKABLE_STATUSES },
    },
    omit: PUBLIC_OMIT,
    include: { items: { select: ITEM_DETAIL_SELECT } },
    orderBy: { createdAt: 'desc' },
  })
}
