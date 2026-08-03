import type { ServiceType } from '@prisma/client'

export type ExpressFilter = 'ALL' | 'EXPRESS' | 'STANDARD'

export interface RoomInvoiceFilters {
  room: string
  guestName: string
  serviceType: ServiceType | ''
  express: ExpressFilter
  from: string
  to: string
}

export interface RoomInvoiceItem {
  id: string
  quantity: number
  unitPrice: number
  subtotal: number
  laundryItem: { nameEn: string }
}

export interface RoomInvoiceRequest {
  id: string
  createdAt: string
  serviceType: ServiceType
  isExpress: boolean
  grossAmount: number
  vatAmount: number
  totalAmount: number
  items: RoomInvoiceItem[]
}

export interface RoomInvoiceData {
  requests: RoomInvoiceRequest[]
  grossTotal: number
  vatTotal: number
  grandTotal: number
  itemCount: number
}
