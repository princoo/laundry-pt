'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Undo2, Pencil } from 'lucide-react'
import { PermissionGate } from '@/components/ui/PermissionGate'
import { FlagRequestModal } from '@/components/staff/FlagRequestModal'
import { useRequestFlag } from '@/lib/hooks/useRequestFlag'
import { formatEventTimestamp } from '@/lib/utils/formatting'
import { FLAG_ELIGIBLE_STATUSES } from '@/lib/constants/statuses'
import type { RequestDetail } from '@/lib/types/request'

interface Props {
  request: RequestDetail
  onChanged: () => void
}

// "The paperwork does not match the bag."
//
// The two actions are gated separately and deliberately: spotting the mismatch
// belongs to whoever collects the bag (LAUNDRY_REQUEST_PROCESS), while deciding
// it is resolved belongs to whoever can correct the order
// (LAUNDRY_REQUEST_EDIT). So this is not one PermissionGate around the card.
export function NeedsChangesCard({ request, onChanged }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { flag, unflag, isSaving, error, dismissError } = useRequestFlag(request.id, onChanged)

  const canBeFlagged = FLAG_ELIGIBLE_STATUSES.includes(request.status)

  // Nothing to say: not flagged, and too late to flag it.
  if (!request.needsChanges && !canBeFlagged) return null

  if (!request.needsChanges) {
    return (
      <PermissionGate permission="LAUNDRY_REQUEST_PROCESS">
        <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-salt-text">Does this match the items?</p>
            <p className="text-xs text-salt-text-muted mt-0.5">
              Flag it for changes if the list and the bag disagree.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="border border-[0.5px] border-salt-border rounded-lg px-4 py-2.5 text-sm text-salt-text hover:bg-salt-cream transition-colors inline-flex items-center justify-center gap-2 shrink-0"
          >
            <AlertTriangle className="w-4 h-4" />
            Flag for changes
          </button>
        </div>

        {isModalOpen && (
          <FlagRequestModal
            isSaving={isSaving}
            error={error}
            onSubmit={async (reason) => {
              if (await flag(reason)) setIsModalOpen(false)
            }}
            onClose={() => {
              dismissError()
              setIsModalOpen(false)
            }}
          />
        )}
      </PermissionGate>
    )
  }

  return (
    <div className="bg-amber-50 rounded-xl border border-[0.5px] border-amber-200 p-4 sm:p-6">
      <div className="flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-900">Flagged for changes</p>
          {request.flagReason && (
            <p className="text-sm text-amber-900 mt-1">{request.flagReason}</p>
          )}
          <p className="text-xs text-amber-800 mt-1">
            {request.flaggedBy?.name ?? 'Unknown'}
            {request.flaggedAt && ` · ${formatEventTimestamp(request.flaggedAt)}`}
            {request.status === 'PENDING'
              ? ' · the guest can still update it themselves'
              : ' · the guest cannot change it at this stage'}
          </p>

          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

          {/* Both always available while flagged, even past the point where
              flagging is allowed — otherwise a flag that reached DELIVERED
              could never be withdrawn. */}
          <PermissionGate permission="LAUNDRY_REQUEST_EDIT">
            <div className="mt-3 flex flex-wrap gap-2">
              {canBeFlagged && (
                <Link
                  href={`/staff/requests/${request.id}/edit`}
                  className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Correct request
                </Link>
              )}
              <button
                type="button"
                onClick={unflag}
                disabled={isSaving}
                className="border border-[0.5px] border-amber-300 bg-white rounded-lg px-4 py-2 text-sm text-amber-900 hover:bg-amber-100 transition-colors inline-flex items-center gap-2 disabled:opacity-60"
              >
                <Undo2 className="w-4 h-4" />
                {isSaving ? 'Clearing…' : 'Clear flag'}
              </button>
            </div>
          </PermissionGate>
        </div>
      </div>
    </div>
  )
}
