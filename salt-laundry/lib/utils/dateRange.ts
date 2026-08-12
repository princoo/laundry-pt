import { hotelDateKey, hotelParts, hotelWallTime } from '@/lib/utils/hotelTime'

export const QUICK_RANGES = ['This month', 'Last month', 'Last 30 days', 'Last 90 days'] as const

export type QuickRange = (typeof QUICK_RANGES)[number]

export interface DateRange {
  from: string
  to: string
}

// These build the from/to a report is actually run for, and the server reads
// them as hotel days — so they are picked in hotel time too. Otherwise a
// supervisor looking at the dashboard from another timezone asks for a
// different "this month" than the one they are shown.
export function toISODate(date: Date): string {
  return hotelDateKey(date)
}

export function startOfMonth(date: Date): Date {
  const { year, month } = hotelParts(date)
  return hotelWallTime(year, month, 1)
}

export function rangeFor(quick: QuickRange): DateRange {
  const today = new Date()
  const { year, month, day } = hotelParts(today)

  if (quick === 'This month') {
    return { from: toISODate(startOfMonth(today)), to: toISODate(today) }
  }
  if (quick === 'Last month') {
    // Day 0 of this month is the last day of the previous one.
    const lastMonthEnd = hotelWallTime(year, month, 0)
    return { from: toISODate(startOfMonth(lastMonthEnd)), to: toISODate(lastMonthEnd) }
  }
  const days = quick === 'Last 30 days' ? 30 : 90
  return { from: toISODate(hotelWallTime(year, month, day - days + 1)), to: toISODate(today) }
}

export function matchQuickRange(from: string, to: string): QuickRange | null {
  return QUICK_RANGES.find((quick) => {
    const range = rangeFor(quick)
    return range.from === from && range.to === to
  }) ?? null
}
