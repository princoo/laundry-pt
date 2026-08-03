import { formatCurrency } from '@/lib/utils/formatting'

interface Props {
  count: number
  itemCount: number
  grandTotal: number
}

export function RoomInvoiceSummary({ count, itemCount, grandTotal }: Props) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
      <span className="text-[20px] font-medium text-salt-navy">{formatCurrency(grandTotal)}</span>
      <span className="text-[13px] text-salt-text-sec">
        {count} request{count === 1 ? '' : 's'} · {itemCount} item{itemCount === 1 ? '' : 's'}
      </span>
    </div>
  )
}
