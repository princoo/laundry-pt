'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { AdminAccessDenied } from '@/components/admin/AdminAccessDenied'
import { ItemsTable } from '@/components/admin/ItemsTable'
import { ItemFormModal } from '@/components/admin/ItemFormModal'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { FetchError } from '@/components/ui/FetchError'
import { useAdminItems, type AdminItem } from '@/lib/hooks/useAdminItems'

export default function StaffItemsPage() {
  const { data: session, status } = useSession()
  const { items, isLoading, fetchError, error, toggleActive, refetch, clearError } = useAdminItems()
  const [modalItem, setModalItem] = useState<AdminItem | 'new' | null>(null)

  if (status !== 'loading' && (session?.user as any)?.role !== 'ADMIN') {
    return <AdminAccessDenied />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[22px] font-black text-salt-text">Item catalogue</h1>
          {!isLoading && !fetchError && (
            <p className="text-sm text-salt-text-sec mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} · {items.filter((i) => i.isActive).length} active
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setModalItem('new')}
          className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-4 py-2 text-sm shrink-0"
        >
          Add item
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={5} height="h-14" rounded="rounded-xl" />
      ) : fetchError ? (
        <FetchError message={fetchError} onRetry={refetch} />
      ) : (
        <ItemsTable items={items} onToggle={toggleActive} onEdit={setModalItem} />
      )}

      {modalItem && (
        <ItemFormModal
          item={modalItem === 'new' ? null : modalItem}
          onClose={() => setModalItem(null)}
          onSaved={() => {
            setModalItem(null)
            refetch()
          }}
        />
      )}

      <ErrorToast message={error} onDismiss={clearError} />
    </div>
  )
}
