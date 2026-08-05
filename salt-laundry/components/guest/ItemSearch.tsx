'use client'

import { Search } from 'lucide-react'
import type { ServiceType } from '@prisma/client'
import { ItemSearchOption, OPTION_ID_PREFIX } from '@/components/guest/ItemSearchOption'
import { getUnitPrice, serviceForSelection } from '@/lib/utils/selections'
import { useItemSearch } from '@/lib/hooks/useItemSearch'
import type { LaundryItemOption, Selections } from '@/lib/types/guestOrder'

const RESULTS_ID = 'item-search-results'

interface Props {
  items: LaundryItemOption[]
  selections: Selections
  defaultServiceType: ServiceType
  onAdd: (item: LaundryItemOption) => void
}

// Type-ahead over the catalogue, for guests who know what they want and don't
// want to scroll the whole list to find it. Picking adds one; the list below
// stays intact so browsing still works.
export function ItemSearch({ items, selections, defaultServiceType, onAdd }: Props) {
  const {
    query, changeQuery, results, isOpen, highlight, setHighlight, pick, onKeyDown, containerRef,
  } = useItemSearch(items, onAdd)

  return (
    <div ref={containerRef} className="relative mb-3">
      <Search className="w-4 h-4 text-salt-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(event) => changeQuery(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search items…"
        aria-label="Search items"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={RESULTS_ID}
        aria-autocomplete="list"
        // Focus stays put, so the highlight is announced from here.
        aria-activedescendant={isOpen ? `${OPTION_ID_PREFIX}${results[highlight]?.id}` : undefined}
        className="w-full border border-[0.5px] border-salt-border rounded-lg pl-9 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:border-salt-navy"
      />

      {isOpen && (
        <div
          id={RESULTS_ID}
          role="listbox"
          className="absolute z-30 inset-x-0 top-full mt-1 max-h-64 overflow-y-auto bg-white border border-[0.5px] border-salt-border rounded-lg shadow-sm py-1"
        >
          {results.map((item, index) => (
            <ItemSearchOption
              key={item.id}
              item={item}
              unitPrice={getUnitPrice(
                item,
                serviceForSelection(item, selections[item.id], defaultServiceType)
              )}
              inOrder={selections[item.id]?.quantity ?? 0}
              isHighlighted={index === highlight}
              onHighlight={() => setHighlight(index)}
              onPick={() => pick(item)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
