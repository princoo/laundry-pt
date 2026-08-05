import { prisma } from '@/lib/prisma'
import { aggregateByServiceType } from '@/lib/utils/reportStats'
import type { Report, ReportItemStat } from '@/lib/types/report'

export interface ReportFilters {
  from: Date
  to: Date
}

export async function generateReport(filters: ReportFilters): Promise<Report> {
  const requests = await prisma.request.findMany({
    where: {
      status: 'DELIVERED',
      createdAt: { gte: filters.from, lte: filters.to },
    },
    include: {
      items: { include: { laundryItem: { select: { nameEn: true } } } },
    },
  })

  const requestCount = requests.length
  const grossRevenue = requests.reduce((s, r) => s + r.grossAmount, 0)
  const vatRevenue = requests.reduce((s, r) => s + r.vatAmount, 0)
  const totalRevenue = requests.reduce((s, r) => s + r.totalAmount, 0)
  const avgOrderValue = requestCount > 0 ? Math.round(totalRevenue / requestCount) : 0

  const { byServiceType, serviceRevenue } = aggregateByServiceType(requests)

  const expressRequests = requests.filter((r) => r.isExpress)
  const expressCount = expressRequests.length
  const expressRevenue = expressRequests.reduce((s, r) => s + r.totalAmount, 0)

  const itemStats: Record<string, ReportItemStat> = {}
  for (const request of requests) {
    for (const item of request.items) {
      const name = item.laundryItem.nameEn
      itemStats[name] ??= { name, quantity: 0, revenue: 0 }
      itemStats[name].quantity += item.quantity
      itemStats[name].revenue += item.subtotal
    }
  }
  const topItems = Object.values(itemStats)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10)

  const byDay: Record<string, number> = {}
  for (const r of requests) {
    const day = r.createdAt.toISOString().split('T')[0]
    byDay[day] = (byDay[day] ?? 0) + r.totalAmount
  }
  const revenueByDay = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({ date, total }))

  const byRoom: Record<string, number> = {}
  for (const r of requests) byRoom[r.roomNumber] = (byRoom[r.roomNumber] ?? 0) + r.totalAmount
  const topRooms = Object.entries(byRoom)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([room, total]) => ({ room, total }))

  return {
    period: { from: filters.from.toISOString(), to: filters.to.toISOString() },
    summary: { grossRevenue, vatRevenue, totalRevenue, requestCount, avgOrderValue },
    byServiceType,
    serviceRevenue,
    expressCount,
    expressRevenue,
    topItems,
    revenueByDay,
    topRooms,
  }
}
