import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { formatCurrency } from '@/lib/utils/formatting'

interface Props {
  nameEn: string
  nameFr: string
  price: number
  quantity: number
  onChange: (quantity: number) => void
}

export function ItemRow({ nameEn, nameFr, price, quantity, onChange }: Props) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 transition-colors ${
        quantity > 0 ? 'bg-salt-cream rounded-lg px-3 -mx-3' : ''
      }`}
    >
      <div>
        <p className="text-sm font-medium text-salt-text">{nameEn}</p>
        <p className="text-xs text-salt-text-muted">
          {nameFr} · {formatCurrency(price)} each
        </p>
      </div>
      <QuantityStepper value={quantity} onChange={onChange} />
    </div>
  )
}
