import { ItemRow } from '@/components/admin/ItemRow'
import type { AdminItem } from '@/lib/hooks/useAdminItems'

interface Props {
  items: AdminItem[]
  onToggle: (id: string, isActive: boolean) => void
  onEdit: (item: AdminItem) => void
}

const HEADERS = ['Item (EN / FR)', 'Normal', 'Dry-cleaning', 'Pressing', 'Active', 'Actions']

export function ItemsTable({ items, onToggle, onEdit }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-10 text-center text-sm text-salt-text-sec">
        No items in the catalogue yet.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-salt-cream text-salt-text-muted text-xs uppercase">
            {HEADERS.map((h) => (
              <th key={h} className="py-3 px-5 text-left font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemRow key={item.id} item={item} onToggle={onToggle} onEdit={onEdit} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
