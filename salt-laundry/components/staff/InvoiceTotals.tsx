import { formatCurrency } from '@/lib/utils/formatting'

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
    <div className="flex flex-col items-end gap-2 mt-4 text-[14px]">
      <div className="flex justify-between w-64">
        <span className="text-gray-600">Subtotal (excl. VAT):</span>
        <span>{formatCurrency(grossAmount)}</span>
      </div>
      <div className="flex justify-between w-64">
        <span className="text-gray-600">VAT 15%:</span>
        <span>{formatCurrency(vatAmount)}</span>
      </div>
      <div className="w-64 border-t border-black" />
      <div
        className={`flex justify-between w-64 font-medium text-[#0d2137] ${
          large ? 'text-[22px]' : 'text-[18px]'
        }`}
      >
        <span>{totalLabel}:</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  )
}
