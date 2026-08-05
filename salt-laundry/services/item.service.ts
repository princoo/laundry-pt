import { prisma } from '@/lib/prisma'
import { getPriceForService } from '@/lib/utils/pricing'
import { SERVICE_TYPES } from '@/lib/constants/services'
import { pageSlice, type PageParams } from '@/lib/utils/pagination'
import type { CreateItemInput, UpdateItemInput } from '@/lib/validations/item.schema'

// Every active item with each service it's actually priced for, so the guest
// form can offer a per-item service dropdown without a round trip per change.
// Availability goes through getPriceForService so the API and the server-side
// re-price agree on what "unpriced" means (null *and* 0).
export async function getActiveItemsWithServices() {
  const items = await prisma.laundryItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return items
    .map(item => ({
      id: item.id,
      nameEn: item.nameEn,
      nameFr: item.nameFr,
      services: SERVICE_TYPES.flatMap(type => {
        const price = getPriceForService(item, type)
        return price === null ? [] : [{ type, price }]
      }),
    }))
    .filter(item => item.services.length > 0)
}

export async function getActiveItemsByIds(ids: string[]) {
  return prisma.laundryItem.findMany({
    where: { id: { in: ids }, isActive: true },
  })
}

// sortOrder isn't unique, so it alone can hand the same row to two pages —
// id breaks the tie and makes the ordering total.
export async function getAllItems(pageParams: PageParams) {
  const [items, total, activeCount] = await Promise.all([
    prisma.laundryItem.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      ...pageSlice(pageParams),
    }),
    prisma.laundryItem.count(),
    prisma.laundryItem.count({ where: { isActive: true } }),
  ])
  return { items, total, activeCount }
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
