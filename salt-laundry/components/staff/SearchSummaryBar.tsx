import { formatCurrency } from '@/lib/utils/formatting'

interface Props {
  count: number
  room?: string
  billableTotal: number
}

export function SearchSummaryBar({ count, room, billableTotal }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-3">
      <span className="text-sm text-salt-text-sec">
        {count} request{count === 1 ? '' : 's'} found{room ? ` for room ${room}` : ''}
      </span>
      <div className="flex items-baseline gap-1.5 sm:flex-col sm:items-end sm:gap-0">
        <span className="text-[15px] font-medium text-salt-navy">{formatCurrency(billableTotal)}</span>
        <span className="text-xs text-salt-text-muted">billable, delivered only</span>
      </div>
    </div>
  )
}
