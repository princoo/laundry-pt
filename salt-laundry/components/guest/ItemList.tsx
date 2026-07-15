import { Shirt } from 'lucide-react'
import { ItemRow } from '@/components/guest/ItemRow'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import type { LaundryItemOption } from '@/lib/hooks/useItems'

interface Props {
  items: LaundryItemOption[]
  quantities: Record<string, number>
  onQuantityChange: (id: string, quantity: number) => void
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

export function ItemList({ items, quantities, onQuantityChange, isLoading, error, onRetry }: Props) {
  const totalCount = Object.values(quantities).reduce((sum, q) => sum + q, 0)

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5">
      <div className="flex items-center justify-between border-b-[0.5px] border-salt-border pb-3 mb-3">
        <p className="text-[11px] uppercase tracking-wide text-salt-text-muted font-medium">
          Select items
        </p>
        {totalCount > 0 && (
          <span className="flex items-center gap-1.5 text-base font-medium text-salt-text-sec">
            <Shirt className="w-6 h-6 text-salt-green" /> {totalCount} items
          </span>
        )}
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={3} />
      ) : error ? (
        <FetchError message={error} onRetry={onRetry} />
      ) : items.length === 0 ? (
        <p className="text-sm text-salt-text-muted text-center py-6">
          No items available yet. Prices are being configured.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-salt-border">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              nameEn={item.nameEn}
              nameFr={item.nameFr}
              price={item.price}
              quantity={quantities[item.id] ?? 0}
              onChange={(quantity) => onQuantityChange(item.id, quantity)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
