import { prisma } from '@/lib/prisma'
import type { Role } from '@prisma/client'

interface Actor {
  id: string
  role: Role
}

export async function getStaffStats(actor: Actor) {
  const startOfToday = new Date()
  startOfToday.setUTCHours(0, 0, 0, 0)

  const assignedFilter = actor.role === 'HOUSEKEEPER' ? { assignedToId: actor.id } : {}
  const unacknowledgedWhere =
    actor.role === 'HOUSEKEEPER'
      ? { assignedToId: actor.id, acknowledgedAt: null, status: 'PENDING' as const }
      : { assignedToId: { not: null }, acknowledgedAt: null, status: 'PENDING' as const }

  const [pending, collected, inProgress, ready, deliveredToday, unacknowledged, unassigned] =
    await Promise.all([
      prisma.request.count({ where: { ...assignedFilter, status: 'PENDING' } }),
      prisma.request.count({ where: { ...assignedFilter, status: 'COLLECTED' } }),
      prisma.request.count({ where: { ...assignedFilter, status: 'IN_PROGRESS' } }),
      prisma.request.count({ where: { ...assignedFilter, status: 'READY' } }),
      prisma.request.count({
        where: { ...assignedFilter, status: 'DELIVERED', returnedAt: { gte: startOfToday } },
      }),
      prisma.request.count({ where: unacknowledgedWhere }),
      prisma.request.count({ where: { assignedToId: null, status: 'PENDING' } }),
    ])

  return { pending, collected, inProgress, ready, deliveredToday, unacknowledged, unassigned }
}
