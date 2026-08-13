import type { RequestStatus, ServiceType } from '@prisma/client'

export interface QueueRequest {
  id: string
  reference: string
  roomNumber: string
  guestName: string | null
  serviceTypes: ServiceType[]
  isExpress: boolean
  status: RequestStatus
  needsChanges: boolean
  totalAmount: number
  createdAt: string
  totalItems: number
  itemNames: string[]
  assignedTo: { id: string; name: string | null } | null
  assignedAt: string | null
  collectedAt: string | null; completedAt: string | null
}

export interface QueueStats {
  pending: number
  collected: number
  inProgress: number
  ready: number
  deliveredToday: number
  unassigned: number
  needsAttention: number
}

// One tile on the dashboard's stat bar. `tone: 'alert'` colours the figure red
// for counts that mean something is wrong.
export interface QueueMetric {
  key: keyof QueueStats
  label: string
  tone?: 'alert'
}
