import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import type { ServiceType } from '@prisma/client'

export interface RoomInvoiceQueryFilters {
  room: string
  guestName?: string
  serviceType?: ServiceType
  isExpress?: boolean
  from?: Date
  to?: Date
}

function buildWhere(filters: RoomInvoiceQueryFilters): Prisma.RequestWhereInput {
  const where: Prisma.RequestWhereInput = {
    roomNumber: { equals: filters.room, mode: 'insensitive' },
    status: 'DELIVERED',
  }
  if (filters.guestName?.trim()) {
    where.guestName = { contains: filters.guestName.trim(), mode: 'insensitive' }
  }
  if (filters.serviceType) where.serviceType = filters.serviceType
  if (filters.isExpress !== undefined) where.isExpress = filters.isExpress
  if (filters.from || filters.to) {
    where.createdAt = {
      ...(filters.from ? { gte: filters.from } : {}),
      ...(filters.to ? { lte: filters.to } : {}),
    }
  }
  return where
}

export async function getRoomInvoiceData(filters: RoomInvoiceQueryFilters) {
  const requests = await prisma.request.findMany({
    where: buildWhere(filters),
    orderBy: { createdAt: 'asc' },
    include: { items: { include: { laundryItem: { select: { nameEn: true } } } } },
  })

  return {
    requests,
    grossTotal: requests.reduce((sum, r) => sum + r.grossAmount, 0),
    vatTotal: requests.reduce((sum, r) => sum + r.vatAmount, 0),
    grandTotal: requests.reduce((sum, r) => sum + r.totalAmount, 0),
    itemCount: requests.reduce(
      (sum, r) => sum + r.items.reduce((n, item) => n + item.quantity, 0),
      0
    ),
  }
}
