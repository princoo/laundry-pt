'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { RequestActions } from '@/components/staff/RequestActions'
import { RequestTimestamps } from '@/components/staff/RequestTimestamps'
import { RequestHeaderCard } from '@/components/ui/RequestHeaderCard'
import { ItemBreakdownCard } from '@/components/ui/ItemBreakdownCard'
import { StatusStepper } from '@/components/ui/StatusStepper'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { FetchError } from '@/components/ui/FetchError'
import { useRequestDetail } from '@/lib/hooks/useRequestDetail'

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const {
    request, isLoading, notFound, fetchError, isUpdating, actionError,
    updateStatus, refetch, clearError,
  } = useRequestDetail(id)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link href="/staff" className="text-salt-text-sec text-sm">
        ← Back to dashboard
      </Link>

      {isLoading && (
        <div className="mt-6">
          <LoadingSkeleton rows={4} height="h-16" rounded="rounded-xl" />
        </div>
      )}

      {!isLoading && fetchError && (
        <div className="mt-6">
          <FetchError message={fetchError} onRetry={refetch} />
        </div>
      )}

      {!isLoading && !fetchError && notFound && (
        <p className="text-sm text-salt-text-sec mt-6">Request not found</p>
      )}

      {!isLoading && !fetchError && request && (
        <div className="mt-4">
          <RequestHeaderCard request={request} reference={request.reference} />
          <ItemBreakdownCard request={request} />

          <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-6 mt-4">
            <div className="text-[11px] uppercase text-salt-text-muted mb-4">Status</div>
            <StatusStepper
              status={request.status}
              collectedAt={request.collectedAt}
              completedAt={request.completedAt}
              returnedAt={request.returnedAt}
            />
            <RequestActions
              status={request.status}
              isUpdating={isUpdating}
              onAdvance={updateStatus}
              onCancel={() => updateStatus('CANCELLED')}
            />
          </div>

          <RequestTimestamps
            createdAt={request.createdAt}
            collectedAt={request.collectedAt}
            completedAt={request.completedAt}
            returnedAt={request.returnedAt}
          />
        </div>
      )}

      <ErrorToast message={actionError} onDismiss={clearError} />
    </div>
  )
}
