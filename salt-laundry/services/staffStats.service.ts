import { prisma } from '@/lib/prisma'

export async function getStaffStats() {
  const startOfToday = new Date()
  startOfToday.setUTCHours(0, 0, 0, 0)

  const [pending, collected, inProgress, ready, deliveredToday] = await Promise.all([
    prisma.request.count({ where: { status: 'PENDING' } }),
    prisma.request.count({ where: { status: 'COLLECTED' } }),
    prisma.request.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.request.count({ where: { status: 'READY' } }),
    prisma.request.count({
      where: { status: 'DELIVERED', returnedAt: { gte: startOfToday } },
    }),
  ])

  return { pending, collected, inProgress, ready, deliveredToday }
}
