import { formatCurrency } from '@/lib/utils/formatting'

interface Props {
  count: number
  totalAll: number
  billableTotal: number
}

export function SearchTableFooter({ count, totalAll, billableTotal }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-[0.5px] border-salt-border text-sm">
      <span className="text-salt-text-sec">Showing {count} result{count === 1 ? '' : 's'}</span>
      <div className="text-right">
        <div className="text-salt-text-sec">Total across all results: {formatCurrency(totalAll)}</div>
        <div className="text-salt-navy font-medium">Billable (delivered only): {formatCurrency(billableTotal)}</div>
      </div>
    </div>
  )
}
