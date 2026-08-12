import type { ServiceType } from '@prisma/client'

export type NotificationKind = 'new' | 'assigned' | 'unassigned'

export interface StaffNotification {
  kind: NotificationKind
  id: string
  reference: string
  roomNumber: string
  guestName: string | null
  serviceTypes: ServiceType[]
  isExpress: boolean
  totalAmount: number
  timestamp: string
}
