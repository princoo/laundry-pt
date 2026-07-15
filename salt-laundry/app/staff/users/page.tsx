'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { AdminAccessDenied } from '@/components/admin/AdminAccessDenied'
import { UsersTable } from '@/components/admin/UsersTable'
import { UserFormModal } from '@/components/admin/UserFormModal'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { useAdminUsers, type AdminUser } from '@/lib/hooks/useAdminUsers'

export default function StaffUsersPage() {
  const { data: session, status } = useSession()
  const { users, isLoading, error, refetch } = useAdminUsers()
  const [modalUser, setModalUser] = useState<AdminUser | 'new' | null>(null)

  if (status !== 'loading' && (session?.user as any)?.role !== 'ADMIN') {
    return <AdminAccessDenied />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[22px] font-black text-salt-text">Staff accounts</h1>
        <button
          type="button"
          onClick={() => setModalUser('new')}
          className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-4 py-2 text-sm"
        >
          Add staff member
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={5} height="h-14" rounded="rounded-xl" />
      ) : error ? (
        <FetchError message={error} onRetry={refetch} />
      ) : (
        <UsersTable users={users} onEdit={setModalUser} />
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
    </div>
  )
}
