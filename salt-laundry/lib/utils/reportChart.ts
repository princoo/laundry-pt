import type { ReportDayRevenue } from '@/lib/types/report'

export interface ChartBar {
  label: string
  total: number
  tooltip: string
}

const MS_PER_DAY = 86_400_000

function formatDayLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('en-RW', { weekday: 'short', day: 'numeric' })
}

export function buildRevenueChartBars(
  revenueByDay: ReportDayRevenue[],
  from: string,
  to: string
): ChartBar[] {
  const fromDate = new Date(`${from}T00:00:00`)
  const toDate = new Date(`${to}T00:00:00`)
  const totalDays = Math.round((toDate.getTime() - fromDate.getTime()) / MS_PER_DAY) + 1

  if (totalDays <= 31) {
    return revenueByDay.map(({ date, total }) => {
      const label = formatDayLabel(date)
      return { label, total, tooltip: `${label} — RWF ${total.toLocaleString()}` }
    })
  }

  const buckets = new Map<number, number>()
  for (const { date, total } of revenueByDay) {
    const dayOffset = Math.floor((new Date(`${date}T00:00:00`).getTime() - fromDate.getTime()) / MS_PER_DAY)
    const week = Math.floor(dayOffset / 7)
    buckets.set(week, (buckets.get(week) ?? 0) + total)
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([week, total]) => {
      const weekStart = new Date(fromDate.getTime() + week * 7 * MS_PER_DAY)
      const label = `Wk ${formatDayLabel(weekStart.toISOString().split('T')[0])}`
      return { label, total, tooltip: `Week of ${formatDayLabel(weekStart.toISOString().split('T')[0])} — RWF ${total.toLocaleString()}` }
    })
}
