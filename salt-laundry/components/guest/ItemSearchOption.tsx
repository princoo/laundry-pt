import { Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatting'
import type { LaundryItemOption } from '@/lib/types/guestOrder'

export const OPTION_ID_PREFIX = 'item-search-option-'

interface Props {
  item: LaundryItemOption
  unitPrice: number
  inOrder: number
  isHighlighted: boolean
  onHighlight: () => void
  onPick: () => void
}

export function ItemSearchOption({
  item, unitPrice, inOrder, isHighlighted, onHighlight, onPick,
}: Props) {
  return (
    <button
      type="button"
      role="option"
      id={`${OPTION_ID_PREFIX}${item.id}`}
      aria-selected={isHighlighted}
      onMouseEnter={onHighlight}
      onClick={onPick}
      className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-left transition-colors ${
        isHighlighted ? 'bg-salt-cream' : ''
      }`}
    >
      <span className="min-w-0">
        <span className="block text-sm text-salt-text truncate">{item.nameEn}</span>
        <span className="block text-xs text-salt-text-muted truncate">{item.nameFr}</span>
      </span>

      <span className="flex items-center gap-2 shrink-0">
        {/* Already in the order — so a second Enter reads as "one more", not a
            mistake the guest has to go and check. */}
        {inOrder > 0 && (
          <span className="text-[11px] text-salt-navy font-medium">×{inOrder}</span>
        )}
        <span className="text-xs text-salt-text-sec whitespace-nowrap">
          {formatCurrency(unitPrice)}
        </span>
        <Plus className="w-4 h-4 text-salt-green" />
      </span>
    </button>
  )
}
