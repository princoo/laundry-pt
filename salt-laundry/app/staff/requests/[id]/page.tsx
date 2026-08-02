'use client'

import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { RequestDetailTopBar } from '@/components/staff/RequestDetailTopBar'
import { AlertBanner } from '@/components/staff/AlertBanner'
import { RequestStatusCard } from '@/components/staff/RequestStatusCard'
import { RequestNotes } from '@/components/staff/RequestNotes'
import { RequestTimestamps } from '@/components/staff/RequestTimestamps'
import { AlertHistoryPanel } from '@/components/staff/AlertHistoryPanel'
import { RequestDetailActions } from '@/components/staff/RequestDetailActions'
import { RequestHeaderCard } from '@/components/ui/RequestHeaderCard'
import { ItemBreakdownCard } from '@/components/ui/ItemBreakdownCard'
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
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
        <div className="mt-4">
          <AlertBanner request={request} />
          <RequestDetailActions
            request={request}
            requestId={id}
            userId={user?.id}
            role={user?.role}
            onChanged={refetch}
          />
          <RequestHeaderCard request={request} reference={request.reference} />
          <ItemBreakdownCard request={request} />
          {request.canManage && (
            <>
              <RequestStatusCard
                request={request}
                isUpdating={isUpdating}
                onAdvance={updateStatus}
                onCancel={() => updateStatus('CANCELLED')}
              />

              <RequestNotes requestId={id} initialNotes={request.notes} />
            </>
          )}
          <RequestTimestamps
            createdAt={request.createdAt}
            collectedAt={request.collectedAt}
            completedAt={request.completedAt}
            returnedAt={request.returnedAt}
          />
          {request.alertEvents && <AlertHistoryPanel events={request.alertEvents} />}
        </div>
      )}

      <ErrorToast message={actionError} onDismiss={clearError} />
    </div>
  )
}
