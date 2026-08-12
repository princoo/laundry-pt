import { PermissionGate } from '@/components/ui/PermissionGate'

interface Props {
  total: number
  activeCount: number
  showCount: boolean
  onAdd: () => void
}

// Counts come from the server rather than the loaded rows — with pagination,
// items.length is only ever the current page.
export function ItemsPageHeader({ total, activeCount, showCount, onAdd }: Props) {
  return (
    <div className="flex items-start justify-between gap-3 mb-6">
      <div>
        <h1 className="text-[22px] font-black text-salt-text">Item catalogue</h1>
        {showCount && (
          <p className="text-sm text-salt-text-sec mt-1">
            {total} {total === 1 ? 'item' : 'items'} · {activeCount} active
          </p>
        )}
      </div>
      <PermissionGate permission="LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE">
        <button
          type="button"
          onClick={onAdd}
          className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-4 py-2 text-sm shrink-0"
        >
          Add item
        </button>
      </PermissionGate>
    </div>
  )
}
