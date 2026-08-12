import type { ReportDayRevenue } from '@/lib/types/report'

export interface ChartBar {
  label: string
  total: number
  tooltip: string
}

const MS_PER_DAY = 86_400_000

// These are calendar dates, not instants — the day keys the report is already
// bucketed by in hotel time. So they are parsed and formatted entirely in UTC,
// which never shifts them: reading '2026-08-12T00:00:00' in a zone ahead of UTC
// and writing it back out with toISOString() lands on the 11th.
const asCalendarDate = (dateStr: string) => new Date(`${dateStr}T00:00:00Z`)
const toCalendarKey = (date: Date) => date.toISOString().split('T')[0]

function formatDayLabel(dateStr: string): string {
  return asCalendarDate(dateStr).toLocaleDateString('en-RW', {
    weekday: 'short', day: 'numeric', timeZone: 'UTC',
  })
}

export function buildRevenueChartBars(
  revenueByDay: ReportDayRevenue[],
  from: string,
  to: string
): ChartBar[] {
  const fromDate = asCalendarDate(from)
  const toDate = asCalendarDate(to)
  const totalDays = Math.round((toDate.getTime() - fromDate.getTime()) / MS_PER_DAY) + 1

  if (totalDays <= 31) {
    return revenueByDay.map(({ date, total }) => {
      const label = formatDayLabel(date)
      return { label, total, tooltip: `${label} — RWF ${total.toLocaleString()}` }
    })
  }

  const buckets = new Map<number, number>()
  for (const { date, total } of revenueByDay) {
    const dayOffset = Math.floor((asCalendarDate(date).getTime() - fromDate.getTime()) / MS_PER_DAY)
    const week = Math.floor(dayOffset / 7)
    buckets.set(week, (buckets.get(week) ?? 0) + total)
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([week, total]) => {
      const weekStart = toCalendarKey(new Date(fromDate.getTime() + week * 7 * MS_PER_DAY))
      const label = `Wk ${formatDayLabel(weekStart)}`
      return { label, total, tooltip: `Week of ${formatDayLabel(weekStart)} — RWF ${total.toLocaleString()}` }
    })
}
