import { prisma } from '@/lib/prisma'
import { ACTIVE_STATUSES } from '@/services/assignment.service'

// Housekeeper roster split by shift availability, for the supervisor panel.
export async function getStaffOverview() {
  const housekeepers = await prisma.user.findMany({
    where: { role: 'HOUSEKEEPER', isActive: true },
    select: {
      id: true,
      name: true,
      isAvailable: true,
      _count: {
        select: { assignedRequests: { where: { status: { in: ACTIVE_STATUSES } } } },
      },
    },
    orderBy: { name: 'asc' },
  })

  return {
    onShift: housekeepers
      .filter((h) => h.isAvailable)
      .map((h) => ({ id: h.id, name: h.name, activeTaskCount: h._count.assignedRequests })),
    offShift: housekeepers
      .filter((h) => !h.isAvailable)
      .map((h) => ({ id: h.id, name: h.name })),
  }
}
