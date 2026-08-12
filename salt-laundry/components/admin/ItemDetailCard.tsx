'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { ActiveToggle } from '@/components/ui/ActiveToggle'
import { PermissionGate } from '@/components/ui/PermissionGate'
import type { AdminItemDetail } from '@/lib/hooks/useAdminItemDetail'

interface Props {
  item: AdminItemDetail
  isUpdating: boolean
  onToggle: (isActive: boolean) => void
  onEdit: () => void
  onRemove: () => void
}

export function ItemDetailCard({ item, isUpdating, onToggle, onEdit, onRemove }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] font-black text-salt-text truncate">{item.nameEn}</h1>
          <p className="text-sm text-salt-text-sec mt-1">{item.nameFr}</p>
        </div>
        <PermissionGate permission="LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 border border-[0.5px] border-salt-border rounded-lg px-3 py-1.5 text-sm text-salt-text hover:bg-salt-cream transition-colors shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        </PermissionGate>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-salt-border">
        <div className="flex items-center gap-3">
          <PermissionGate permission="LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE">
            <ActiveToggle checked={item.isActive} onChange={() => onToggle(!item.isActive)} />
          </PermissionGate>
          <span className="text-sm text-salt-text-sec">
            {item.isActive ? 'Active — guests can request this item' : 'Inactive — hidden from guests'}
          </span>
        </div>
        <PermissionGate permission="LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE">
          <button
            type="button"
            onClick={onRemove}
            disabled={isUpdating}
            className="flex items-center gap-1.5 text-red-600 text-sm hover:underline disabled:opacity-60"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove item
          </button>
        </PermissionGate>
      </div>
    </div>
  )
}
