import { formatCurrency } from '@/lib/utils/formatting'

interface Props {
  count: number
  totalAll: number
  billableTotal: number
  standalone?: boolean
}

export function SearchTableFooter({ count, totalAll, billableTotal, standalone }: Props) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 text-sm ${
        standalone
          ? 'bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm'
          : 'border-t border-[0.5px] border-salt-border'
      }`}
    >
      <span className="text-salt-text-sec">Showing {count} result{count === 1 ? '' : 's'}</span>
      <div className="sm:text-right">
        <div className="text-salt-text-sec">Total across all results: {formatCurrency(totalAll)}</div>
        <div className="text-salt-navy font-medium">Billable (delivered only): {formatCurrency(billableTotal)}</div>
      </div>
    </div>
  )
}
