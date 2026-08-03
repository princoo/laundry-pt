import type { RequestStatus, ServiceType } from '@prisma/client'

export interface QueueRequest {
  id: string
  reference: string
  roomNumber: string
  guestName: string | null
  serviceType: ServiceType
  isExpress: boolean
  status: RequestStatus
  totalAmount: number
  createdAt: string
  totalItems: number
  itemNames: string[]
  assignedTo: { id: string; name: string | null } | null
  assignedAt: string | null
  acknowledgedAt: string | null
  collectedAt: string | null; completedAt: string | null
}

export interface QueueStats {
  pending: number
  collected: number
  inProgress: number
  ready: number
  deliveredToday: number
  unacknowledged: number
  unassigned: number
}
