'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { AdminAccessDenied } from '@/components/admin/AdminAccessDenied'
import { UsersPageHeader } from '@/components/admin/UsersPageHeader'
import { UsersTable } from '@/components/admin/UsersTable'
import { UsersPageModals } from '@/components/admin/UsersPageModals'
import { Pagination } from '@/components/ui/Pagination'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { usePagedList } from '@/lib/hooks/usePagedList'
import { useClampPage } from '@/lib/hooks/useClampPage'
import { useAdminUsers, type AdminUser } from '@/lib/hooks/useAdminUsers'
import { useToggleAvailability } from '@/lib/hooks/useToggleAvailability'

export default function StaffUsersPage() {
  const { data: session, status } = useSession()
  const { page, setPage } = usePagedList()
  const { users, total, totalPages, activeCount, isLoading, error, refetch } = useAdminUsers(page)
  const [modalUser, setModalUser] = useState<AdminUser | 'new' | null>(null)
  const [resetUser, setResetUser] = useState<AdminUser | null>(null)
  const [resetToast, setResetToast] = useState<string | null>(null)
  const { toggle, toastMessage, dismissToast } = useToggleAvailability(refetch)
  useClampPage(page, totalPages, setPage)

  if (status !== 'loading' && (session?.user as any)?.role !== 'ADMIN') {
    return <AdminAccessDenied />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <UsersPageHeader
        total={total}
        activeCount={activeCount}
        showCount={!isLoading && !error}
        onAdd={() => setModalUser('new')}
      />

      {isLoading ? (
        <LoadingSkeleton rows={5} height="h-14" rounded="rounded-xl" />
      ) : error ? (
        <FetchError message={error} onRetry={refetch} />
      ) : (
        <>
          <UsersTable
            users={users}
            currentUserId={(session?.user as any)?.id}
            onEdit={setModalUser}
            onResetPassword={setResetUser}
            onToggleAvailability={toggle}
          />
          <div className="mt-4">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
      )}

      <UsersPageModals
        modalUser={modalUser}
        resetUser={resetUser}
        currentUserId={(session?.user as any)?.id}
        onCloseForm={() => setModalUser(null)}
        onSaved={(wasNew) => {
          setModalUser(null)
          // Newest accounts sort to page 1 — go there so the new row is visible.
          if (wasNew) setPage(1)
          refetch()
        }}
        onCloseReset={() => setResetUser(null)}
        onReset={(name) => {
          setResetUser(null)
          setResetToast(`${name}'s password has been reset.`)
        }}
      />

      <ErrorToast message={toastMessage} onDismiss={dismissToast} variant="success" />
      <ErrorToast message={resetToast} onDismiss={() => setResetToast(null)} variant="success" />
    </div>
  )
}
