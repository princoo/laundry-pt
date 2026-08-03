import { formatCurrency } from '@/lib/utils/formatting'
import type { AdminItemDetail } from '@/lib/hooks/useAdminItemDetail'

const ROWS = [
  { key: 'priceNormal', label: 'Normal wash' },
  { key: 'priceDryClean', label: 'Dry-cleaning' },
  { key: 'pricePressing', label: 'Pressing' },
] as const

interface Props {
  item: AdminItemDetail
}

export function ItemPriceGrid({ item }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-6">
      <div className="text-[11px] uppercase text-salt-text-muted mb-4">Pricing</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ROWS.map(({ key, label }) => {
          const price = item[key]
          return (
            <div key={key} className="border border-[0.5px] border-salt-border rounded-lg px-4 py-3">
              <div className="text-xs text-salt-text-muted mb-1">{label}</div>
              {price ? (
                <div className="text-base font-medium text-salt-text">{formatCurrency(price)}</div>
              ) : (
                <div className="text-sm text-salt-text-muted">Not offered</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
