import { prisma } from '@/lib/prisma'
import { countActiveAlerts } from '@/services/requestAlert.service'
import type { Role } from '@prisma/client'

interface Actor {
  id: string
  role: Role
}

export async function getStaffStats(actor: Actor) {
  const startOfToday = new Date()
  startOfToday.setUTCHours(0, 0, 0, 0)

  const assignedFilter = actor.role === 'HOUSEKEEPER' ? { assignedToId: actor.id } : {}

  const [grouped, deliveredToday, unassigned, needsAttention] = await Promise.all([
    prisma.request.groupBy({ by: ['status'], where: assignedFilter, _count: true }),
    prisma.request.count({
      where: { ...assignedFilter, status: 'DELIVERED', returnedAt: { gte: startOfToday } },
    }),
    prisma.request.count({ where: { assignedToId: null, status: 'PENDING' } }),
    // Scoped the same way as the status counts, so a housekeeper sees their own
    // overdue work and a supervisor sees the hotel's.
    countActiveAlerts(assignedFilter),
  ])

  const byStatus = new Map(grouped.map((row) => [row.status, row._count]))

  return {
    pending: byStatus.get('PENDING') ?? 0,
    collected: byStatus.get('COLLECTED') ?? 0,
    inProgress: byStatus.get('IN_PROGRESS') ?? 0,
    ready: byStatus.get('READY') ?? 0,
    deliveredToday,
    unassigned,
    needsAttention,
  }
}
