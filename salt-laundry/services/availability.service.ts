import { prisma } from '@/lib/prisma'
import { autoAssign, releaseAssignment } from '@/services/assignment.service'

export class AdminAvailabilityError extends Error {}

// Toggles a housekeeper's shift availability. Turning it off immediately
// redistributes their PENDING + unacknowledged tasks — anything already
// COLLECTED or IN_PROGRESS stays with them, since they have the items.
export async function setHousekeeperAvailability(userId: string, isAvailable: boolean) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, name: true },
  })
  if (!user) return null
  if (user.role === 'ADMIN') throw new AdminAvailabilityError()

  await prisma.user.update({ where: { id: userId }, data: { isAvailable } })

  if (isAvailable) {
    return { isAvailable: true, reassignedCount: 0, name: user.name }
  }

  const pendingTasks = await prisma.request.findMany({
    where: { assignedToId: userId, acknowledgedAt: null, status: 'PENDING' },
    select: { id: true },
  })

  for (const task of pendingTasks) {
    await releaseAssignment(task.id, userId)
    await autoAssign(task.id, userId)
  }

  return { isAvailable: false, reassignedCount: pendingTasks.length, name: user.name }
}
