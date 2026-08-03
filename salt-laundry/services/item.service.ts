import { prisma } from '@/lib/prisma'
import { getPriceForService } from '@/lib/utils/pricing'
import type { ServiceType } from '@prisma/client'
import type { CreateItemInput, UpdateItemInput } from '@/lib/validations/item.schema'

export async function getActiveItemsByService(serviceType: ServiceType) {
  const items = await prisma.laundryItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
  return items
    .filter(item => getPriceForService(item, serviceType) !== null)
    .map(item => ({
      id: item.id,
      nameEn: item.nameEn,
      nameFr: item.nameFr,
      price: getPriceForService(item, serviceType)!,
    }))
}

export async function getActiveItemsByIds(ids: string[]) {
  return prisma.laundryItem.findMany({
    where: { id: { in: ids }, isActive: true },
  })
}

export async function getAllItems() {
  return prisma.laundryItem.findMany({ orderBy: { sortOrder: 'asc' } })
}

export async function getItemById(id: string) {
  const item = await prisma.laundryItem.findUnique({ where: { id } })
  if (!item) return null

  const stats = await prisma.requestItem.aggregate({
    where: { laundryItemId: id },
    _count: { id: true },
    _sum: { quantity: true, subtotal: true },
  })

  return {
    ...item,
    timesOrdered: stats._count.id,
    totalQuantity: stats._sum.quantity ?? 0,
    totalRevenue: stats._sum.subtotal ?? 0,
  }
}

export async function createItem(data: CreateItemInput) {
  return prisma.laundryItem.create({ data })
}

export async function updateItem(id: string, data: UpdateItemInput) {
  const existing = await prisma.laundryItem.findUnique({ where: { id } })
  if (!existing) return null
  return prisma.laundryItem.update({ where: { id }, data })
}

export async function softDeleteItem(id: string) {
  const existing = await prisma.laundryItem.findUnique({ where: { id } })
  if (!existing) return null
  return prisma.laundryItem.update({ where: { id }, data: { isActive: false } })
}
