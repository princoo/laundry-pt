'use client'

import { ActiveToggle } from '@/components/ui/ActiveToggle'
import { formatCurrency } from '@/lib/utils/formatting'
import type { AdminItem } from '@/lib/hooks/useAdminItems'

interface Props {
  item: AdminItem
  onToggle: (id: string, isActive: boolean) => void
  onEdit: (item: AdminItem) => void
}

function PriceCell({ price }: { price: number | null }) {
  if (price === null || price === 0) {
    return <span className="text-salt-text-muted">—</span>
  }
  return <span className="text-salt-text">{formatCurrency(price)}</span>
}

export function ItemRow({ item, onToggle, onEdit }: Props) {
  return (
    <tr className="border-b border-[0.5px] border-salt-border last:border-0">
      <td className="py-4 px-5">
        <div className="font-medium text-salt-text">{item.nameEn}</div>
        <div className="text-xs text-salt-text-muted mt-0.5">{item.nameFr}</div>
      </td>
      <td className="py-4 px-5">
        <PriceCell price={item.priceNormal} />
      </td>
      <td className="py-4 px-5">
        <PriceCell price={item.priceDryClean} />
      </td>
      <td className="py-4 px-5">
        <PriceCell price={item.pricePressing} />
      </td>
      <td className="py-4 px-5">
        <ActiveToggle checked={item.isActive} onChange={() => onToggle(item.id, !item.isActive)} />
      </td>
      <td className="py-4 px-5">
        <button type="button" onClick={() => onEdit(item)} className="text-salt-navy text-sm underline">
          Edit
        </button>
      </td>
    </tr>
  )
}
