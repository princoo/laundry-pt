import type { RequestStatus } from '@prisma/client'

// See the note in lib/constants/services.ts on why this is a literal tuple.
export const REQUEST_STATUSES = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED',
] as const satisfies readonly RequestStatus[]

// The lifecycle in order, for the progress stepper. Ends at DELIVERED because
// CANCELLED isn't a step — it's an exit.
export const LIFECYCLE_STEPS: RequestStatus[] = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY', 'DELIVERED',
]

// Work still on a housekeeper's plate — the basis of every active-task count.
// Same members as TRACKABLE_STATUSES today, but they answer different questions.
export const ACTIVE_STATUSES: RequestStatus[] = ['PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY']

// Orders still in progress for a room — used to find "my order" by room number
// alone, since a room's request is always finished before the next guest arrives.
export const TRACKABLE_STATUSES: RequestStatus[] = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY',
]

// Filter chips above a request list. 'ALL' is a UI-only pseudo-status.
export const QUEUE_STATUS_FILTERS = [
  'ALL', 'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY',
] as const

// A housekeeper also needs to look back at work already closed out.
export const MY_TASK_STATUS_FILTERS = [
  'ALL', ...REQUEST_STATUSES,
] as const

// A guest can only edit a request that hasn't been picked up yet. Once it's in
// the laundry's hands the order it's working from has to stay fixed.
export const GUEST_EDITABLE_STATUS: RequestStatus = 'PENDING'

// Where a request can be flagged for changes. DELIVERED is out because the
// amount is already on the guest's room bill, and CANCELLED because there is
// nothing left to correct. Clearing a flag is deliberately NOT limited to these
// — a flag that somehow outlived its request must always be withdrawable.
export const FLAG_ELIGIBLE_STATUSES: RequestStatus[] = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY',
]

// Told to staff when they try to flag a request that has moved beyond it.
export const FLAG_LOCKED_REASONS: Partial<Record<RequestStatus, string>> = {
  DELIVERED: 'This request has been delivered and billed, so it can no longer be flagged for changes.',
  CANCELLED: 'This request was cancelled, so there is nothing to correct.',
}

// Blocked at the last hop only: the clothes still get washed while the
// paperwork is corrected, but delivering settles the bill.
export const DELIVER_WHILE_FLAGGED =
  'Resolve the changes this request was flagged for before delivering it.'

// What a guest is told when their request is awaiting changes. Deliberately
// fixed copy — flagReason is staff shorthand written for other staff.
export const NEEDS_CHANGES_GUEST_MESSAGE =
  'Our team found a difference between your list and the items collected.'

// Why an edit is closed off, in the guest's terms — keyed by where the request
// has got to. PENDING is empty because nothing is locked there.
export const EDIT_LOCKED_REASONS: Record<RequestStatus, string> = {
  PENDING:     '',
  COLLECTED:   'Your items have been collected, so this request can no longer be edited.',
  IN_PROGRESS: 'Your items are being cleaned, so this request can no longer be edited.',
  READY:       'Your order is ready, so this request can no longer be edited.',
  DELIVERED:   'This request has been delivered.',
  CANCELLED:   'This request was cancelled.',
}

// The narrower case: collected between opening the edit form and saving it.
export const COLLECTED_MID_EDIT =
  'This request has just been collected and can no longer be edited.'

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
