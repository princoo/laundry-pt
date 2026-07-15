import type { RequestStatus, ServiceType } from '@prisma/client'

export interface RequestDetailItem {
  id: string
  quantity: number
  unitPrice: number
  subtotal: number
  laundryItem: { nameEn: string; nameFr: string }
}

export interface RequestDetail {
  id: string
  roomNumber: string
  guestName: string | null
  serviceType: ServiceType
  isExpress: boolean
  isHanger: boolean
  note: string | null
  status: RequestStatus
  grossAmount: number
  vatAmount: number
  totalAmount: number
  createdAt: string
  collectedAt: string | null
  completedAt: string | null
  returnedAt: string | null
  items: RequestDetailItem[]
}

export interface TrackedRequest extends RequestDetail {
  reference: string
}
