import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import type { RequestStatus, ServiceType } from '@prisma/client'

export interface SearchFilters {
  room?: string
  name?: string
  status?: RequestStatus
  serviceType?: ServiceType
  from?: Date
  to?: Date
}

export async function searchRequests(filters: SearchFilters) {
  const where: Prisma.RequestWhereInput = {}

  if (filters.room?.trim()) {
    where.roomNumber = { contains: filters.room.trim(), mode: 'insensitive' }
  }
  if (filters.name?.trim()) {
    where.guestName = { contains: filters.name.trim(), mode: 'insensitive' }
  }
  if (filters.status) where.status = filters.status
  if (filters.serviceType) where.serviceType = filters.serviceType
  if (filters.from || filters.to) {
    where.createdAt = {
      ...(filters.from ? { gte: filters.from } : {}),
      ...(filters.to ? { lte: filters.to } : {}),
    }
  }

  const rows = await prisma.request.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, roomNumber: true, guestName: true, serviceType: true,
      isExpress: true, status: true, totalAmount: true, createdAt: true,
      items: { select: { quantity: true } },
    },
  })

  const requests = rows.map(({ items, ...rest }) => ({
    ...rest,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  }))

  const billableTotal = requests
    .filter((r) => r.status === 'DELIVERED')
    .reduce((sum, r) => sum + r.totalAmount, 0)

  return { requests, billableTotal }
}
