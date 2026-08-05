'use client'

import { UserFormModal } from '@/components/admin/UserFormModal'
import { ResetPasswordModal } from '@/components/admin/ResetPasswordModal'
import type { AdminUser } from '@/lib/hooks/useAdminUsers'

interface Props {
  modalUser: AdminUser | 'new' | null
  resetUser: AdminUser | null
  currentUserId: string
  onCloseForm: () => void
  onSaved: (wasNew: boolean) => void
  onCloseReset: () => void
  onReset: (name: string) => void
}

export function UsersPageModals({
  modalUser, resetUser, currentUserId, onCloseForm, onSaved, onCloseReset, onReset,
}: Props) {
  return (
    <>
      {modalUser && (
        <UserFormModal
          user={modalUser === 'new' ? null : modalUser}
          currentUserId={currentUserId}
          onClose={onCloseForm}
          onSaved={() => onSaved(modalUser === 'new')}
        />
      )}

      {resetUser && (
        <ResetPasswordModal user={resetUser} onClose={onCloseReset} onReset={onReset} />
      )}
    </>
  )
}
