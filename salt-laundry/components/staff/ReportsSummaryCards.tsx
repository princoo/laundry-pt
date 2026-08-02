import { formatCurrency } from '@/lib/utils/formatting'
import type { ReportSummary } from '@/lib/types/report'

interface Props {
  summary: ReportSummary
  expressCount: number
  expressRevenue: number
}

export function ReportsSummaryCards({ summary, expressCount, expressRevenue }: Props) {
  const cards = [
    { label: 'Total revenue', value: formatCurrency(summary.totalRevenue), primary: true },
    { label: 'Gross (excl. VAT)', value: formatCurrency(summary.grossRevenue) },
    { label: 'VAT collected', value: formatCurrency(summary.vatRevenue) },
    { label: 'Requests delivered', value: String(summary.requestCount) },
    { label: 'Avg. order value', value: formatCurrency(summary.avgOrderValue) },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5">
          <div className="text-xs text-salt-text-muted">{card.label}</div>
          <div className={`text-xl font-medium mt-1 ${card.primary ? 'text-salt-navy' : 'text-salt-text'}`}>
            {card.value}
          </div>
        </div>
      ))}

      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5">
        <div className="text-xs text-salt-text-muted">Express revenue</div>
        <div className="text-xl font-medium mt-1 text-salt-text">{formatCurrency(expressRevenue)}</div>
        <div className="text-xs text-salt-text-muted mt-1">({expressCount} orders)</div>
      </div>
    </div>
  )
}
