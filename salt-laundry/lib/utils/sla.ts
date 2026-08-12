import type { RequestStatus, ServiceType } from '@prisma/client'
import { hotelDateAtHour } from '@/lib/utils/hotelTime'

const PICKUP_LIMIT_MINUTES = 45   // PENDING threshold — someone must collect
const RETURN_LIMIT_MINUTES = 30   // READY threshold — clean clothes must go back
const RISK_WINDOW_MINUTES  = 90   // Warn when this close to the overall deadline

export type AlertLevel =
  | 'pickup_overdue'    // PENDING too long — nobody came to collect
  | 'return_overdue'    // READY too long — clean clothes sitting unreturned
  | 'at_risk'           // Overall deadline approaching
  | 'deadline_missed'   // Past the hotel's return promise
  | null

// Return-by deadline: Express 15:00, Normal/Pressing 19:00, Dry-clean 20:00.
// Rolls to the next day if placed after that cutoff, so a 19:55 order isn't
// born overdue. A mixed request takes the LATEST cutoff among its lines — it
// isn't finished until its slowest part is.
export function getReturnDeadline(
  serviceTypes: readonly ServiceType[],
  isExpress: boolean,
  createdAt: Date | string = new Date()
): Date {
  const created = new Date(createdAt)

  const deadlineHour =
    isExpress                             ? 15 :
    serviceTypes.includes('DRY_CLEAN')    ? 20 :
    19  // NORMAL + PRESSING

  // Hotel time, not the server's. "Back by 7:00 p.m." is a promise made at the
  // front desk, so on a UTC container this must still resolve to 19:00 in
  // Kigali — otherwise every deadline silently slips two hours and requests
  // read as on-time when they are late.
  const deadline = hotelDateAtHour(created, deadlineHour)
  if (deadline.getTime() <= created.getTime()) {
    return hotelDateAtHour(created, deadlineHour, 1)
  }
  return deadline
}

// Single entry point — returns the most severe alert level for a request,
// or null if everything is on track.
export function getAlertLevel(request: {
  status:       RequestStatus
  serviceTypes: readonly ServiceType[]
  isExpress:    boolean
  createdAt:    Date | string
  completedAt?: Date | string | null
}): AlertLevel {
  // Terminal states — never alert
  if (request.status === 'DELIVERED' || request.status === 'CANCELLED') return null

  // Step 1: Pickup overdue — nobody collected yet
  if (request.status === 'PENDING') {
    const elapsedMin =
      (Date.now() - new Date(request.createdAt).getTime()) / 60_000
    if (elapsedMin > PICKUP_LIMIT_MINUTES) return 'pickup_overdue'
  }

  // Step 2: Return overdue — clean clothes sitting unreturned
  if (request.status === 'READY' && request.completedAt) {
    const elapsedMin =
      (Date.now() - new Date(request.completedAt).getTime()) / 60_000
    if (elapsedMin > RETURN_LIMIT_MINUTES) return 'return_overdue'
  }

  // Step 3: Overall deadline check — applies to all active statuses
  const deadline      = getReturnDeadline(request.serviceTypes, request.isExpress, request.createdAt)
  const minsRemaining = (deadline.getTime() - Date.now()) / 60_000

  if (minsRemaining <= 0)                  return 'deadline_missed'
  if (minsRemaining <= RISK_WINDOW_MINUTES) return 'at_risk'

  return null
}

// Helper: returns true if any alertable condition exists.
// Use this for filtering — avoids checking for null at every call site.
export function hasAlert(request: Parameters<typeof getAlertLevel>[0]): boolean {
  return getAlertLevel(request) !== null
}
