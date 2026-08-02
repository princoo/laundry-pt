import { InvoiceTotals } from '@/components/staff/InvoiceTotals'

interface Props {
  count: number
  grossTotal: number
  vatTotal: number
  grandTotal: number
}

export function RoomInvoiceGrandTotal({ count, grossTotal, vatTotal, grandTotal }: Props) {
  return (
    <div className="mt-8 pt-6 border-t border-black">
      <div className="text-[14px] text-gray-600 mb-2">
        Total across {count} request{count === 1 ? '' : 's'}:
      </div>
      <InvoiceTotals
        grossAmount={grossTotal}
        vatAmount={vatTotal}
        totalAmount={grandTotal}
        totalLabel="GRAND TOTAL"
        large
      />
    </div>
  )
}
