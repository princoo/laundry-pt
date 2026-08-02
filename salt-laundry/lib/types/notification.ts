import type { ServiceType } from '@prisma/client'

export type NotificationKind = 'new' | 'auto_assigned' | 'manual_assigned' | 'unassigned'

export interface StaffNotification {
  kind: NotificationKind
  id: string
  reference: string
  roomNumber: string
  guestName: string | null
  serviceType: ServiceType
  isExpress: boolean
  totalAmount: number
  timestamp: string
}
