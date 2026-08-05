import { ShoppingBag } from 'lucide-react'
import { ExpressToggle } from '@/components/guest/ExpressToggle'
import { HandlingToggle } from '@/components/guest/HandlingToggle'
import { NoteField } from '@/components/guest/NoteField'
import { PriceBreakdown } from '@/components/guest/PriceBreakdown'
import { SubmitSection, type SubmissionProps } from '@/components/guest/SubmitSection'
import type { SelectedLine } from '@/lib/utils/orderSummary'

interface Props {
  selectedLines: SelectedLine[]
  gross: number
  vat: number
  total: number
  isExpress: boolean
  onIsExpressChange: (value: boolean) => void
  canSubmit: boolean
  submission: SubmissionProps
}

export function OrderSummary({
  selectedLines,
  gross,
  vat,
  total,
  isExpress,
  onIsExpressChange,
  canSubmit,
  submission,
}: Props) {
  if (selectedLines.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5 flex flex-col items-center justify-center text-center gap-2 py-10">
        <ShoppingBag className="w-6 h-6 text-salt-text-muted" />
        <p className="text-sm text-salt-text-muted">Select items to see your order total</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5 flex flex-col gap-3">
      <p className="text-[11px] uppercase tracking-wide text-salt-text-muted font-medium">
        Order summary
      </p>

      <PriceBreakdown selectedLines={selectedLines} gross={gross} vat={vat} total={total} />

      <HandlingToggle />

      {/* The only express control on the form — it applies to the whole order. */}
      <ExpressToggle isExpress={isExpress} onChange={onIsExpressChange} />

      <NoteField />

      <SubmitSection canSubmit={canSubmit} {...submission} />
    </div>
  )
}
