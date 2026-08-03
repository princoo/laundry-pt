'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { AdminAccessDenied } from '@/components/admin/AdminAccessDenied'
import { UsersPageHeader } from '@/components/admin/UsersPageHeader'
import { UsersTable } from '@/components/admin/UsersTable'
import { UserFormModal } from '@/components/admin/UserFormModal'
import { ResetPasswordModal } from '@/components/admin/ResetPasswordModal'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { useAdminUsers, type AdminUser } from '@/lib/hooks/useAdminUsers'
import { useToggleAvailability } from '@/lib/hooks/useToggleAvailability'

export default function StaffUsersPage() {
  const { data: session, status } = useSession()
  const { users, isLoading, error, refetch } = useAdminUsers()
  const [modalUser, setModalUser] = useState<AdminUser | 'new' | null>(null)
  const [resetUser, setResetUser] = useState<AdminUser | null>(null)
  const [resetToast, setResetToast] = useState<string | null>(null)
  const { toggle, toastMessage, dismissToast } = useToggleAvailability(refetch)

  if (status !== 'loading' && (session?.user as any)?.role !== 'ADMIN') {
    return <AdminAccessDenied />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <UsersPageHeader
        users={users}
        showCount={!isLoading && !error}
        onAdd={() => setModalUser('new')}
      />

      {isLoading ? (
        <LoadingSkeleton rows={5} height="h-14" rounded="rounded-xl" />
      ) : error ? (
        <FetchError message={error} onRetry={refetch} />
      ) : (
        <UsersTable
          users={users}
          currentUserId={(session?.user as any)?.id}
          onEdit={setModalUser}
          onResetPassword={setResetUser}
          onToggleAvailability={toggle}
        />
      )}

      {modalUser && (
        <UserFormModal
          user={modalUser === 'new' ? null : modalUser}
          currentUserId={(session?.user as any)?.id}
          onClose={() => setModalUser(null)}
          onSaved={() => {
            setModalUser(null)
            refetch()
          }}
        />
      )}

      {resetUser && (
        <ResetPasswordModal
          user={resetUser}
          onClose={() => setResetUser(null)}
          onReset={(name) => {
            setResetUser(null)
            setResetToast(`${name}'s password has been reset.`)
          }}
        />
      )}

      <ErrorToast message={toastMessage} onDismiss={dismissToast} variant="success" />
      <ErrorToast message={resetToast} onDismiss={() => setResetToast(null)} variant="success" />
    </div>
  )
}
