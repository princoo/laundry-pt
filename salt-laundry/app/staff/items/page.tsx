'use client'

import { useState } from 'react'
import { AccessDenied } from '@/components/ui/AccessDenied'
import { ItemsPageHeader } from '@/components/admin/ItemsPageHeader'
import { ItemsTable } from '@/components/admin/ItemsTable'
import { ItemFormModal } from '@/components/admin/ItemFormModal'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { FetchError } from '@/components/ui/FetchError'
import { useAdminItems, type AdminItem } from '@/lib/hooks/useAdminItems'
import { usePermissions } from '@/lib/hooks/usePermissions'

export default function StaffItemsPage() {
  const { can, isLoading: isSessionLoading } = usePermissions()
  const { items, total, activeCount, isLoading, fetchError, error,
    toggleActive, reorder, refetch, clearError } = useAdminItems()
  const [modalItem, setModalItem] = useState<AdminItem | 'new' | null>(null)

  if (!isSessionLoading && !can('LAUNDRY_REQUEST_ITEMS_CATALOGUE_VIEW')) {
    return <AccessDenied />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <ItemsPageHeader
        total={total}
        activeCount={activeCount}
        showCount={!isLoading && !fetchError}
        onAdd={() => setModalItem('new')}
      />

      {isLoading ? (
        <LoadingSkeleton rows={5} height="h-14" rounded="rounded-xl" />
      ) : fetchError ? (
        <FetchError message={fetchError} onRetry={refetch} />
      ) : (
        <ItemsTable
          items={items}
          onToggle={toggleActive}
          onEdit={setModalItem}
          onReorder={reorder}
        />
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
