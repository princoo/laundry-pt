import { formatCurrency } from '@/lib/utils/formatting'

interface Props {
  count: number
  room?: string
  billableTotal: number
}

export function SearchSummaryBar({ count, room, billableTotal }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
      <span className="text-sm text-salt-text-sec">
        {count} request{count === 1 ? '' : 's'} found{room ? ` for Room ${room}` : ''}
      </span>
      <div className="text-right">
        <div className="text-[15px] text-salt-navy font-medium">
          Billable total (delivered): {formatCurrency(billableTotal)}
        </div>
        <div className="text-xs text-salt-text-muted">
          Only delivered requests are included in the bill.
        </div>
      </div>
    </div>
  )
}
