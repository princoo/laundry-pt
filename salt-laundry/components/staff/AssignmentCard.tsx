'use client'

import { useState } from 'react'
import { ReassignModal } from '@/components/staff/ReassignModal'

interface Props {
  requestId: string
  assignedTo: { id: string; name: string | null } | null
  canReassign: boolean
  onChanged: () => void
}

export function AssignmentCard({ requestId, assignedTo, canReassign, onChanged }: Props) {
  const [isReassigning, setIsReassigning] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-6">
      <div className="text-[11px] uppercase text-salt-text-muted mb-2">Assigned to</div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-salt-text">{assignedTo?.name ?? 'Unassigned'}</span>
        {canReassign && (
          <button
            type="button"
            onClick={() => setIsReassigning(true)}
            className="text-xs text-salt-navy border border-[0.5px] border-salt-border rounded-lg px-3 py-1.5 shrink-0 hover:bg-salt-cream transition-colors"
          >
            Reassign
          </button>
        )}
      </div>

      {isReassigning && (
        <ReassignModal
          requestId={requestId}
          currentAssigneeId={assignedTo?.id ?? null}
          currentAssigneeName={assignedTo?.name}
          onClose={() => setIsReassigning(false)}
          onReassigned={onChanged}
        />
      )}
    </div>
  )
}
