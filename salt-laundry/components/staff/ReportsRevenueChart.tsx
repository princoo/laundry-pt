import { buildRevenueChartBars } from '@/lib/utils/reportChart'
import { formatCurrency } from '@/lib/utils/formatting'
import type { ReportDayRevenue } from '@/lib/types/report'

interface Props {
  revenueByDay: ReportDayRevenue[]
  from: string
  to: string
}

export function ReportsRevenueChart({ revenueByDay, from, to }: Props) {
  if (revenueByDay.length === 0) return null

  if (revenueByDay.length <= 2) {
    return (
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5">
        <h2 className="text-sm font-medium text-salt-text mb-3">Revenue by day</h2>
        <div className="flex gap-6">
          {revenueByDay.map((d) => (
            <div key={d.date}>
              <div className="text-lg font-medium text-salt-navy">{formatCurrency(d.total)}</div>
              <div className="text-xs text-salt-text-muted">{d.date}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const bars = buildRevenueChartBars(revenueByDay, from, to)
  const max = Math.max(...bars.map((b) => b.total), 1)

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-salt-text">Revenue by day</h2>
        <span className="text-xs text-salt-text-muted">{formatCurrency(max)}</span>
      </div>
      <div className="flex items-end gap-1 h-40">
        {bars.map((bar) => (
          <div
            key={bar.label}
            title={bar.tooltip}
            className="flex-1 bg-salt-navy hover:bg-salt-navy-hover transition-colors rounded-sm min-w-[2px]"
            style={{ height: `${Math.max((bar.total / max) * 100, 2)}%` }}
          />
        ))}
      </div>
      <div className="flex gap-1 mt-2">
        {bars.map((bar) => (
          <div key={bar.label} className="flex-1 text-center text-[10px] text-salt-text-muted truncate">
            {bar.label}
          </div>
        ))}
      </div>
    </div>
  )
}
