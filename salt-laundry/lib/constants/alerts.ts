import type { AlertLevel } from '@/lib/utils/sla'

type Key = Exclude<AlertLevel, null>

export const ALERT_LABELS: Record<Key, string> = {
  pickup_overdue: 'Pickup overdue',
  return_overdue: 'Return overdue',
  at_risk: 'At risk',
  deadline_missed: 'Deadline missed',
}

export const ALERT_DESCRIPTIONS: Record<Key, string> = {
  pickup_overdue: 'Nobody has collected this laundry yet.',
  return_overdue: "It's ready but hasn't been returned to the room yet.",
  at_risk: "This request is close to missing today's return deadline.",
  deadline_missed: "Past today's return deadline for this guest.",
}

export const ALERT_BADGE_CLASSES: Record<Key, string> = {
  pickup_overdue: 'bg-red-50 text-red-700',
  return_overdue: 'bg-red-50 text-red-700',
  at_risk: 'bg-amber-50 text-amber-700',
  deadline_missed: 'bg-red-100 text-red-900',
}

export const ALERT_BANNER_CLASSES: Record<Key, string> = {
  pickup_overdue: 'bg-red-50 border-red-200 text-red-800',
  return_overdue: 'bg-red-50 border-red-200 text-red-800',
  at_risk: 'bg-amber-50 border-amber-200 text-amber-800',
  deadline_missed: 'bg-red-100 border-red-300 text-red-900',
}
