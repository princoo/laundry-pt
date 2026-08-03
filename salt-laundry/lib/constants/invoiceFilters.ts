import type { ExpressFilter, RoomInvoiceFilters } from '@/lib/types/roomInvoice'

export const EMPTY_ROOM_INVOICE_FILTERS: RoomInvoiceFilters = {
  room: '',
  guestName: '',
  serviceType: '',
  express: 'ALL',
  from: '',
  to: '',
}

export const EXPRESS_FILTER_OPTIONS: { value: ExpressFilter; label: string }[] = [
  { value: 'ALL', label: 'All requests' },
  { value: 'EXPRESS', label: 'Express only' },
  { value: 'STANDARD', label: 'Standard only' },
]

export const ALL_TIME_LABEL = 'All time'
