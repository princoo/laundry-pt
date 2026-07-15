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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[22px] font-black text-salt-text">Item catalogue</h1>
        <button
          type="button"
          onClick={() => setModalItem('new')}
          className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-4 py-2 text-sm"
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
