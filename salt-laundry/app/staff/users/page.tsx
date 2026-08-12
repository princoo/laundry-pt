'use client'

import { useSession } from 'next-auth/react'
import { AccessDenied } from '@/components/ui/AccessDenied'
import { UsersPageHeader } from '@/components/admin/UsersPageHeader'
import { UsersTable } from '@/components/admin/UsersTable'
import { Pagination } from '@/components/ui/Pagination'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { usePagedList } from '@/lib/hooks/usePagedList'
import { useClampPage } from '@/lib/hooks/useClampPage'
import { useAdminUsers } from '@/lib/hooks/useAdminUsers'
import { useStaffFlags } from '@/lib/hooks/useStaffFlags'
import { usePermissions } from '@/lib/hooks/usePermissions'

export default function StaffUsersPage() {
  // The session is still read directly here for the current user's id, which
  // the table uses to mark the "(You)" row.
  const { data: session } = useSession()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentUserId = ((session?.user as any)?.id ?? '') as string
  const { can, isLoading: isSessionLoading } = usePermissions()
  const { page, setPage } = usePagedList()
  const { users, total, totalPages, activeCount, isLoading, error, refetch } = useAdminUsers(page)
  const { toggleAvailability, toggleHousekeeper, toastMessage, dismissToast } =
    useStaffFlags(refetch)
  useClampPage(page, totalPages, setPage)

  if (!isSessionLoading && !can('LAUNDRY_HOUSEKEEPERS_VIEW')) {
    return <AccessDenied />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <UsersPageHeader total={total} activeCount={activeCount} showCount={!isLoading && !error} />

      {isLoading ? (
        <LoadingSkeleton rows={5} height="h-14" rounded="rounded-xl" />
      ) : error ? (
        <FetchError message={error} onRetry={refetch} />
      ) : (
        <>
          <UsersTable
            users={users}
            currentUserId={currentUserId}
            onToggleAvailability={toggleAvailability}
            onToggleHousekeeper={toggleHousekeeper}
          />
          <div className="mt-4">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
      )}

      <ErrorToast message={toastMessage} onDismiss={dismissToast} variant="success" />
    </div>
  )
}
