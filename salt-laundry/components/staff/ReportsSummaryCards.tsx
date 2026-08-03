import { formatCurrency } from '@/lib/utils/formatting'
import type { ReportSummary } from '@/lib/types/report'

interface Props {
  summary: ReportSummary
  expressCount: number
  expressRevenue: number
}

export function ReportsSummaryCards({ summary, expressCount, expressRevenue }: Props) {
  const stats = [
    { label: 'Gross (excl. VAT)', value: formatCurrency(summary.grossRevenue) },
    { label: 'VAT collected', value: formatCurrency(summary.vatRevenue) },
    { label: 'Requests delivered', value: String(summary.requestCount) },
    { label: 'Avg. order value', value: formatCurrency(summary.avgOrderValue) },
    { label: 'Express revenue', value: formatCurrency(expressRevenue), hint: `${expressCount} orders` },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-salt-navy rounded-xl shadow-sm p-5 sm:p-6">
        <div className="text-xs text-white/70">Total revenue</div>
        <div className="text-3xl font-medium mt-1 text-white">{formatCurrency(summary.totalRevenue)}</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 ${
              i === stats.length - 1 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <div className="text-xs text-salt-text-muted">{stat.label}</div>
            <div className="text-lg font-medium mt-1 text-salt-text">{stat.value}</div>
            {stat.hint && <div className="text-xs text-salt-text-muted mt-0.5">{stat.hint}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
