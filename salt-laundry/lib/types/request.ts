import type { RequestStatus, ServiceType } from '@prisma/client'

export interface RequestDetailItem {
  id: string
  quantity: number
  unitPrice: number
  subtotal: number
  laundryItem: { nameEn: string; nameFr: string }
}

export interface RequestNote {
  id: string
  content: string
  createdAt: string
}

export interface AlertEventRecord {
  level: 'pickup_overdue' | 'return_overdue' | 'at_risk' | 'deadline_missed'
  detectedAt: string
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
  assignedTo: { id: string; name: string | null } | null
  assignedAt: string | null
  acknowledgedAt: string | null
  items: RequestDetailItem[]
  notes: RequestNote[]
  canManage?: boolean
  alertEvents?: AlertEventRecord[]
}

export interface TrackedRequest extends RequestDetail {
  reference: string
}
