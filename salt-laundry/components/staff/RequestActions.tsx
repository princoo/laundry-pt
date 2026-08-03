'use client'

import { useState } from 'react'
import { STATUS_LABELS, STATUS_TRANSITIONS } from '@/lib/constants/statuses'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import type { RequestStatus } from '@prisma/client'

interface Props {
  status: RequestStatus
  isUpdating: boolean
  requiresAcknowledgment?: boolean
  onAdvance: (status: RequestStatus) => void
  onCancel: () => void
}

export function RequestActions({
  status, isUpdating, requiresAcknowledgment = false, onAdvance, onCancel,
}: Props) {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false)

  if (status === 'CANCELLED') {
    return <p className="text-sm text-salt-text-muted mt-4">This request was cancelled.</p>
  }

  const nextStatus = status !== 'DELIVERED' ? STATUS_TRANSITIONS[status][0] : null
  const canCancel = status === 'PENDING' || status === 'COLLECTED'

  return (
    <div className="mt-4">
      {nextStatus && (
        <button
          onClick={() => onAdvance(nextStatus)}
          disabled={isUpdating || requiresAcknowledgment}
          className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-6 py-2.5 font-medium disabled:opacity-60 disabled:hover:bg-salt-navy disabled:cursor-not-allowed flex items-center"
        >
          {isUpdating && (
            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
          )}
          {isUpdating ? 'Updating…' : `Mark as ${STATUS_LABELS[nextStatus]}`}
        </button>
      )}

      {requiresAcknowledgment && (
        <p className="text-xs text-salt-text-muted mt-2">
          Acknowledge this assignment before updating its status.
        </p>
      )}

      {canCancel && (
        <div className="mt-3">
          <button
            onClick={() => setIsConfirmingCancel(true)}
            disabled={requiresAcknowledgment}
            className="text-red-600 text-sm hover:underline disabled:text-salt-text-muted disabled:no-underline disabled:cursor-not-allowed"
          >
            Cancel request
          </button>
        </div>
      )}

      {isConfirmingCancel && (
        <ConfirmModal
          title="Cancel request"
          message="Cancel this laundry request? This cannot be undone."
          confirmLabel="Cancel request"
          cancelLabel="Keep request"
          isDestructive
          onConfirm={() => { setIsConfirmingCancel(false); onCancel() }}
          onCancel={() => setIsConfirmingCancel(false)}
        />
      )}
    </div>
  )
}
