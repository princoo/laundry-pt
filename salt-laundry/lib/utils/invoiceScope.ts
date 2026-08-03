import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { formatInvoiceDate } from '@/lib/utils/formatting'
import type { RoomInvoiceFilters } from '@/lib/types/roomInvoice'

type PeriodScope = Pick<RoomInvoiceFilters, 'from' | 'to'>
type ServiceScope = Pick<RoomInvoiceFilters, 'serviceType' | 'express'>

// A bare 'YYYY-MM-DD' parses as UTC midnight and can render as the previous
// day; the time suffix pins it to the reader's own day.
const asLocalDay = (isoDay: string) => formatInvoiceDate(`${isoDay}T00:00:00`)

export function formatBillingPeriod({ from, to }: PeriodScope): string {
  if (!from && !to) return 'All delivered requests'
  if (from && !to) return `From ${asLocalDay(from)}`
  if (!from && to) return `Up to ${asLocalDay(to)}`
  if (from === to) return asLocalDay(from)
  return `${asLocalDay(from)} – ${asLocalDay(to)}`
}

export function describeServiceScope({ serviceType, express }: ServiceScope): string {
  const service = serviceType ? SERVICE_TYPE_LABELS[serviceType] : 'All services'
  if (express === 'EXPRESS') return `${service}, express only`
  if (express === 'STANDARD') return `${service}, standard only`
  return service
}

export function countActiveFilters(filters: RoomInvoiceFilters): number {
  return [
    filters.guestName.trim(),
    filters.serviceType,
    filters.express === 'ALL' ? '' : filters.express,
    filters.from,
    filters.to,
  ].filter(Boolean).length
}
