export const QUICK_RANGES = ['This month', 'Last month', 'Last 30 days', 'Last 90 days'] as const

export type QuickRange = (typeof QUICK_RANGES)[number]

export interface DateRange {
  from: string
  to: string
}

export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function rangeFor(quick: QuickRange): DateRange {
  const today = new Date()
  if (quick === 'This month') {
    return { from: toISODate(startOfMonth(today)), to: toISODate(today) }
  }
  if (quick === 'Last month') {
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
    return { from: toISODate(startOfMonth(lastMonthEnd)), to: toISODate(lastMonthEnd) }
  }
  const days = quick === 'Last 30 days' ? 30 : 90
  const from = new Date(today)
  from.setDate(from.getDate() - days + 1)
  return { from: toISODate(from), to: toISODate(today) }
}

export function matchQuickRange(from: string, to: string): QuickRange | null {
  return QUICK_RANGES.find((quick) => {
    const range = rangeFor(quick)
    return range.from === from && range.to === to
  }) ?? null
}
