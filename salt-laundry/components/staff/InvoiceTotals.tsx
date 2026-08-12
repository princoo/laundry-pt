import { formatCurrency } from '@/lib/utils/formatting'
import { vatLabel } from '@/lib/utils/pricing'

interface Props {
  grossAmount: number
  vatAmount: number
  totalAmount: number
  totalLabel?: string
  large?: boolean
}

export function InvoiceTotals({
  grossAmount, vatAmount, totalAmount, totalLabel = 'TOTAL', large = false,
}: Props) {
  return (
    <div className="flex flex-col items-end gap-2 mt-6 text-[14px]">
      <div className="flex justify-between w-full max-w-[280px] text-salt-text-sec">
        <span>Subtotal (excl. VAT)</span>
        <span className="text-salt-text">{formatCurrency(grossAmount)}</span>
      </div>
      <div className="flex justify-between w-full max-w-[280px] text-salt-text-sec">
        <span>{vatLabel(grossAmount, vatAmount)}</span>
        <span className="text-salt-text">{formatCurrency(vatAmount)}</span>
      </div>
      <div
        className={`flex justify-between items-center w-full max-w-[280px] mt-2 bg-salt-cream rounded-lg px-4 py-3 font-medium text-salt-navy ${
          large ? 'text-[22px]' : 'text-[18px]'
        }`}
      >
        <span className="text-[13px] uppercase tracking-wide">{totalLabel}</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  )
}
