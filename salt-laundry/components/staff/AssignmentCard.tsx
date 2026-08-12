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
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-6">
      <div className="text-[11px] uppercase text-salt-text-muted mb-2">Assigned to</div>
      <div className="flex items-center justify-between gap-3">
        <span className={`text-sm ${assignedTo ? 'text-salt-text' : 'text-salt-text-muted'}`}>
          {assignedTo?.name ?? 'Not assigned yet'}
        </span>
        {canReassign && (
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="text-xs text-salt-navy border border-[0.5px] border-salt-border rounded-lg px-3 py-1.5 shrink-0 hover:bg-salt-cream transition-colors"
          >
            {assignedTo ? 'Reassign' : 'Assign'}
          </button>
        )}
      </div>

      {isPickerOpen && (
        <ReassignModal
          requestId={requestId}
          currentAssigneeId={assignedTo?.id ?? null}
          currentAssigneeName={assignedTo?.name}
          onClose={() => setIsPickerOpen(false)}
          onReassigned={onChanged}
        />
      )}
    </div>
  )
}
