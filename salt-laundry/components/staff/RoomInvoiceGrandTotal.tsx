import { InvoiceTotals } from '@/components/staff/InvoiceTotals'

interface Props {
  count: number
  itemCount: number
  grossTotal: number
  vatTotal: number
  grandTotal: number
}

export function RoomInvoiceGrandTotal({ count, itemCount, grossTotal, vatTotal, grandTotal }: Props) {
  return (
    <div className="mt-8 pt-6 border-t-[0.5px] border-salt-border break-inside-avoid">
      <div className="text-[13px] text-salt-text-sec">
        Total across {count} delivered request{count === 1 ? '' : 's'} ·{' '}
        {itemCount} item{itemCount === 1 ? '' : 's'}
      </div>
      <InvoiceTotals
        grossAmount={grossTotal}
        vatAmount={vatTotal}
        totalAmount={grandTotal}
        totalLabel="Grand total"
        large
      />
    </div>
  )
}
