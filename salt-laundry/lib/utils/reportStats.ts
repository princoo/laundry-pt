import type { ServiceType } from '@prisma/client'
import { SERVICE_TYPES } from '@/lib/constants/services'
import type { ReportServiceStat } from '@/lib/types/report'

interface ReportLine {
  serviceType: ServiceType
  quantity: number
  unitPrice: number
}

// Aggregated per LINE, not per request — one request now spans services.
// `count` is items sold; `revenue` is the line base, so the buckets sum to
// `serviceRevenue` (not the VAT- and express-inclusive totalRevenue), which is
// therefore the only correct denominator for a share-of-revenue chart.
export function aggregateByServiceType(requests: readonly { items: ReportLine[] }[]) {
  const byServiceType = Object.fromEntries(
    SERVICE_TYPES.map((type) => [type, { count: 0, revenue: 0 }])
  ) as Record<ServiceType, ReportServiceStat>

  for (const request of requests) {
    for (const item of request.items) {
      byServiceType[item.serviceType].count += item.quantity
      byServiceType[item.serviceType].revenue += item.quantity * item.unitPrice
    }
  }

  const serviceRevenue = SERVICE_TYPES.reduce((s, type) => s + byServiceType[type].revenue, 0)
  return { byServiceType, serviceRevenue }
}
