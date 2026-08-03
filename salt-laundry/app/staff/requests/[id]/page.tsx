'use client'

import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { RequestDetailTopBar } from '@/components/staff/RequestDetailTopBar'
import { RequestDetailContent } from '@/components/staff/RequestDetailContent'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { FetchError } from '@/components/ui/FetchError'
import { useRequestDetail } from '@/lib/hooks/useRequestDetail'

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  const user = session?.user as any
  const {
    request, isLoading, notFound, fetchError, isUpdating, actionError,
    updateStatus, refetch, clearError,
  } = useRequestDetail(id)

  const canAcknowledge =
    user?.role === 'HOUSEKEEPER' && request?.assignedTo?.id === user?.id && !request?.acknowledgedAt
  const canReassign = user?.role === 'SUPERVISOR' || user?.role === 'ADMIN'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <RequestDetailTopBar requestId={id} />

      {isLoading && (
        <div className="mt-6"><LoadingSkeleton rows={4} height="h-16" rounded="rounded-xl" /></div>
      )}
      {!isLoading && fetchError && (
        <div className="mt-6"><FetchError message={fetchError} onRetry={refetch} /></div>
      )}
      {!isLoading && !fetchError && notFound && (
        <p className="text-sm text-salt-text-sec mt-6">Request not found</p>
      )}
      {!isLoading && !fetchError && request && (
        <RequestDetailContent
          request={request}
          requestId={id}
          canAcknowledge={canAcknowledge}
          canReassign={canReassign}
          isUpdating={isUpdating}
          onAdvance={updateStatus}
          onChanged={refetch}
        />
      )}

      <ErrorToast message={actionError} onDismiss={clearError} />
    </div>
  )
}
