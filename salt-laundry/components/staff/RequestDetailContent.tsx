import { AlertBanner } from '@/components/staff/AlertBanner'
import { AcknowledgeButton } from '@/components/staff/AcknowledgeButton'
import { AssignmentCard } from '@/components/staff/AssignmentCard'
import { RequestStatusCard } from '@/components/staff/RequestStatusCard'
import { RequestNotes } from '@/components/staff/RequestNotes'
import { RequestTimestamps } from '@/components/staff/RequestTimestamps'
import { AlertHistoryPanel } from '@/components/staff/AlertHistoryPanel'
import { RequestHeaderCard } from '@/components/ui/RequestHeaderCard'
import { ItemBreakdownCard } from '@/components/ui/ItemBreakdownCard'
import type { TrackedRequest } from '@/lib/types/request'
import type { RequestStatus } from '@prisma/client'

interface Props {
  request: TrackedRequest
  requestId: string
  canAcknowledge: boolean
  canReassign: boolean
  isUpdating: boolean
  onAdvance: (status: RequestStatus) => void
  onChanged: () => void
}

export function RequestDetailContent({
  request, requestId, canAcknowledge, canReassign, isUpdating, onAdvance, onChanged,
}: Props) {
  return (
    <div className="mt-6">
      <AlertBanner request={request} />
      {canAcknowledge && (
        <div className="mb-4">
          <AcknowledgeButton requestId={requestId} onAcknowledged={onChanged} />
        </div>
      )}

      <div className="lg:flex lg:gap-6 lg:items-start">
        <div className="flex-1 min-w-0 space-y-4">
          <RequestHeaderCard request={request} reference={request.reference} />
          {request.canManage && (
            <RequestStatusCard
              request={request}
              isUpdating={isUpdating}
              onAdvance={onAdvance}
              onCancel={() => onAdvance('CANCELLED')}
            />
          )}
          <ItemBreakdownCard request={request} />
        </div>

        <div className="mt-4 lg:mt-0 lg:w-75 shrink-0 space-y-4">
          <AssignmentCard
            requestId={requestId}
            assignedTo={request.assignedTo}
            canReassign={canReassign}
            onChanged={onChanged}
          />
          {request.canManage && (
            <RequestNotes requestId={requestId} initialNotes={request.notes} />
          )}
          <RequestTimestamps
            createdAt={request.createdAt}
            collectedAt={request.collectedAt}
            completedAt={request.completedAt}
            returnedAt={request.returnedAt}
          />
          {request.alertEvents && <AlertHistoryPanel events={request.alertEvents} />}
        </div>
      </div>
    </div>
  )
}
