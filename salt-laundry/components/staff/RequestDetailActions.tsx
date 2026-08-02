'use client'

import { useState } from 'react'
import { AcknowledgeButton } from '@/components/staff/AcknowledgeButton'
import { ReassignModal } from '@/components/staff/ReassignModal'
import type { RequestDetail } from '@/lib/types/request'

interface Props {
  request: RequestDetail
  requestId: string
  userId?: string
  role?: string
  onChanged: () => void
}

export function RequestDetailActions({ request, requestId, userId, role, onChanged }: Props) {
  const [isReassigning, setIsReassigning] = useState(false)
  const canAcknowledge =
    role === 'HOUSEKEEPER' && request.assignedTo?.id === userId && !request.acknowledgedAt
  const canReassign = role === 'SUPERVISOR' || role === 'ADMIN'

  return (
    <>
      {canAcknowledge && <AcknowledgeButton requestId={requestId} onAcknowledged={onChanged} />}

      {canReassign && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => setIsReassigning(true)}
            className="text-salt-navy text-sm underline"
          >
            Reassign
          </button>
        </div>
      )}

      {isReassigning && (
        <ReassignModal
          requestId={requestId}
          currentAssigneeId={request.assignedTo?.id ?? null}
          currentAssigneeName={request.assignedTo?.name}
          onClose={() => setIsReassigning(false)}
          onReassigned={onChanged}
        />
      )}
    </>
  )
}
