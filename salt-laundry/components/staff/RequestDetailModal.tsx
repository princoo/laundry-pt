'use client'

import { Modal } from '@/components/ui/Modal'
import { RequestStatusCard } from '@/components/staff/RequestStatusCard'
import { RequestTimestamps } from '@/components/staff/RequestTimestamps'
import { RequestHeaderCard } from '@/components/ui/RequestHeaderCard'
import { ItemBreakdownCard } from '@/components/ui/ItemBreakdownCard'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { FetchError } from '@/components/ui/FetchError'
import { useRequestDetail } from '@/lib/hooks/useRequestDetail'

interface Props {
  id: string
  onClose: () => void
}

export function RequestDetailModal({ id, onClose }: Props) {
  const {
    request, isLoading, notFound, fetchError, isUpdating, actionError,
    updateStatus, refetch, clearError,
  } = useRequestDetail(id)

  return (
    <Modal title="Request details" onClose={onClose} maxWidthClass="max-w-2xl">
      {isLoading && <LoadingSkeleton rows={4} height="h-16" rounded="rounded-xl" />}

      {!isLoading && fetchError && <FetchError message={fetchError} onRetry={refetch} />}

      {!isLoading && !fetchError && notFound && (
        <p className="text-sm text-salt-text-sec">Request not found</p>
      )}

      {!isLoading && !fetchError && request && (
        <div>
          <RequestHeaderCard request={request} reference={request.reference} />
          <ItemBreakdownCard request={request} />

          {request.canManage && (
            <RequestStatusCard
              request={request}
              isUpdating={isUpdating}
              onAdvance={updateStatus}
              onCancel={() => updateStatus('CANCELLED')}
            />
          )}

          <RequestTimestamps
            createdAt={request.createdAt}
            collectedAt={request.collectedAt}
            completedAt={request.completedAt}
            returnedAt={request.returnedAt}
          />
        </div>
      )}

      <ErrorToast message={actionError} onDismiss={clearError} />
    </Modal>
  )
}
