import { prisma } from '@/lib/prisma'
import { countActiveAlerts } from '@/services/requestAlert.service'
import { hasPermission } from '@/lib/utils/permissions'
import { startOfHotelDay } from '@/lib/utils/hotelTime'

interface Actor {
  id: string
  permissions?: readonly string[]
}

export async function getStaffStats(actor: Actor) {
  // "Today" is the hotel's day. On UTC this used to start at 02:00 Kigali, so
  // anything delivered late the previous evening counted toward today.
  const startOfToday = startOfHotelDay()

  const assignedFilter = hasPermission(actor.permissions, 'LAUNDRY_REQUESTS_VIEW_ALL')
    ? {}
    : { assignedToId: actor.id }

  const [grouped, deliveredToday, unassigned, needsAttention] = await Promise.all([
    prisma.request.groupBy({ by: ['status'], where: assignedFilter, _count: true }),
    prisma.request.count({
      where: { ...assignedFilter, status: 'DELIVERED', returnedAt: { gte: startOfToday } },
    }),
    prisma.request.count({ where: { assignedToId: null, status: 'PENDING' } }),
    // Scoped the same way as the status counts, so someone confined to their
    // own tasks sees their own overdue work and not the hotel's.
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
