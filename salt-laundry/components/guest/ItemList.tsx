import type { ServiceType } from '@prisma/client'
import { Shirt } from 'lucide-react'
import { ItemRow } from '@/components/guest/ItemRow'
import { ItemSearch } from '@/components/guest/ItemSearch'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import type { LaundryItemOption, Selections } from '@/lib/types/guestOrder'

interface Props {
  items: LaundryItemOption[]
  selections: Selections
  defaultServiceType: ServiceType
  onAdd: (item: LaundryItemOption) => void
  onLineQuantityChange: (
    item: LaundryItemOption,
    serviceType: ServiceType,
    quantity: number
  ) => void
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

export function ItemList({
  items, selections, defaultServiceType,
  onAdd, onLineQuantityChange, isLoading, error, onRetry,
}: Props) {
  // Garments, not lines: a shirt washed and a shirt pressed is two of the
  // guest's clothes, which is what this count is answering.
  const totalCount = Object.values(selections).reduce((sum, line) => sum + line.quantity, 0)

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5">
      <div className="flex items-center justify-between border-b-[0.5px] border-salt-border pb-3 mb-3">
        <p className="text-[11px] uppercase tracking-wide text-salt-text-muted font-medium">
          Select items
        </p>
        {totalCount > 0 && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-salt-text">
            <Shirt className="w-4 h-4 text-salt-green" />
            {totalCount} {totalCount === 1 ? 'item' : 'items'}
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
        <>
          <ItemSearch
            items={items}
            selections={selections}
            defaultServiceType={defaultServiceType}
            onAdd={onAdd}
          />
          {/* Pulled out past the card padding so a picked row's tint reads as a
              band in the list rather than a floating block inside it. */}
          <div className="-mx-3 flex flex-col divide-y-[0.5px] divide-salt-border">
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                selections={selections}
                defaultServiceType={defaultServiceType}
                onAdd={() => onAdd(item)}
                onLineQuantityChange={(serviceType, quantity) =>
                  onLineQuantityChange(item, serviceType, quantity)
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
