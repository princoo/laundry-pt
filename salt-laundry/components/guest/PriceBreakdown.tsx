import { formatCurrency } from '@/lib/utils/formatting'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { groupLinesByService, type SelectedLine } from '@/lib/utils/orderSummary'

interface Props {
  selectedLines: SelectedLine[]
  gross: number
  vat: number
  total: number
}

export function PriceBreakdown({ selectedLines, gross, vat, total }: Props) {
  const groups = groupLinesByService(selectedLines)

  return (
    <>
      <div className="flex flex-col gap-3 border-b-[0.5px] border-salt-border pb-3">
        {groups.map((group) => (
          <div key={group.serviceType} className="flex flex-col gap-1.5">
            <p className="text-[11px] uppercase tracking-wide text-salt-text-muted font-medium">
              {SERVICE_TYPE_LABELS[group.serviceType]}
            </p>
            {group.lines.map((line) => (
              <div key={line.id} className="flex items-center justify-between text-sm text-salt-text">
                <span>{line.nameEn} × {line.quantity}</span>
                <span>{formatCurrency(line.subtotal)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-sm font-medium text-salt-text">
          <span>Gross (excl. VAT)</span>
          <span>{formatCurrency(gross)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-salt-text-muted">
          <span>VAT 15%</span>
          <span>{formatCurrency(vat)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t-[0.5px] border-salt-border pt-3">
        <span className="text-[18px] font-medium text-salt-navy">Total</span>
        <span className="text-[18px] font-medium text-salt-navy">{formatCurrency(total)}</span>
      </div>
    </>
  )
}
