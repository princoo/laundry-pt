import type { RequestStatus } from '@prisma/client'

// See the note in lib/constants/services.ts on why this is a literal tuple.
export const REQUEST_STATUSES = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED',
] as const satisfies readonly RequestStatus[]

export const ACTIVE_STATUSES: RequestStatus[] = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY', 'DELIVERED',
]

// Orders still in progress for a room — used to find "my order" by room number
// alone, since a room's request is always finished before the next guest arrives.
export const TRACKABLE_STATUSES: RequestStatus[] = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY',
]

export const STATUS_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  PENDING:     ['COLLECTED', 'CANCELLED'],
  COLLECTED:   ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['READY', 'CANCELLED'],
  READY:       ['DELIVERED', 'CANCELLED'],
  DELIVERED:   [],
  CANCELLED:   [],
}

export const STATUS_BADGE_CLASSES: Record<RequestStatus, string> = {
  PENDING:     'bg-amber-50 text-amber-800',
  COLLECTED:   'bg-blue-50 text-blue-800',
  IN_PROGRESS: 'bg-orange-50 text-orange-800',
  READY:       'bg-green-50 text-green-800',
  DELIVERED:   'bg-gray-100 text-gray-600',
  CANCELLED:   'bg-red-50 text-red-700',
}

export const STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING:     'Pending',
  COLLECTED:   'Collected',
  IN_PROGRESS: 'In progress',
  READY:       'Ready',
  DELIVERED:   'Delivered',
  CANCELLED:   'Cancelled',
}
