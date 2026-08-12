'use client'

import { useParams } from 'next/navigation'
import { RequestDetailTopBar } from '@/components/staff/RequestDetailTopBar'
import { RequestDetailContent } from '@/components/staff/RequestDetailContent'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { FetchError } from '@/components/ui/FetchError'
import { useRequestDetail } from '@/lib/hooks/useRequestDetail'
import { usePermissions } from '@/lib/hooks/usePermissions'

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { can } = usePermissions()
  const {
    request, isLoading, notFound, fetchError, isUpdating, actionError,
    updateStatus, refetch, clearError,
  } = useRequestDetail(id)

  const canReassign = can('LAUNDRY_REQUEST_HOUSEKEEPER_ASSIGN')

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
