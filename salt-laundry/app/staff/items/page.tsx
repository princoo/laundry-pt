'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { AdminAccessDenied } from '@/components/admin/AdminAccessDenied'
import { ItemsPageHeader } from '@/components/admin/ItemsPageHeader'
import { ItemsTable } from '@/components/admin/ItemsTable'
import { ItemFormModal } from '@/components/admin/ItemFormModal'
import { Pagination } from '@/components/ui/Pagination'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { FetchError } from '@/components/ui/FetchError'
import { usePagedList } from '@/lib/hooks/usePagedList'
import { useClampPage } from '@/lib/hooks/useClampPage'
import { useAdminItems, type AdminItem } from '@/lib/hooks/useAdminItems'

export default function StaffItemsPage() {
  const { data: session, status } = useSession()
  const { page, setPage } = usePagedList()
  const { items, total, totalPages, activeCount, isLoading, fetchError, error,
    toggleActive, refetch, clearError } = useAdminItems(page)
  const [modalItem, setModalItem] = useState<AdminItem | 'new' | null>(null)
  useClampPage(page, totalPages, setPage)

  if (status !== 'loading' && (session?.user as any)?.role !== 'ADMIN') {
    return <AdminAccessDenied />
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
        <>
          <ItemsTable items={items} onToggle={toggleActive} onEdit={setModalItem} />
          <div className="mt-4">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
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
