import { prisma } from '@/lib/prisma'
import { ACTIVE_STATUSES } from '@/services/assignment.service'

export class AdminAvailabilityError extends Error {}

// Toggles a housekeeper's shift availability. Going off shift only removes them
// from the auto-assign pool for new requests — work already on their plate stays
// with them until a supervisor reassigns it.
export async function setHousekeeperAvailability(userId: string, isAvailable: boolean) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, name: true },
  })
  if (!user) return null
  if (user.role === 'ADMIN') throw new AdminAvailabilityError()

  await prisma.user.update({ where: { id: userId }, data: { isAvailable } })

  const openTasks = isAvailable
    ? 0
    : await prisma.request.count({
        where: { assignedToId: userId, status: { in: ACTIVE_STATUSES } },
      })

  return { isAvailable, name: user.name, openTasks }
}
