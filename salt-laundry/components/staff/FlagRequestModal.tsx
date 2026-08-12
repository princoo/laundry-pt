'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'

interface Props {
  isSaving: boolean
  error: string | null
  onSubmit: (reason: string) => void
  onClose: () => void
}

const MAX_REASON = 300

// ConfirmModal takes no input, so this builds on Modal directly — same shape as
// ReassignModal. The reason is required: it is what the person who has to fix
// the request reads, and it is the only part of the flag that reaches the notes.
export function FlagRequestModal({ isSaving, error, onSubmit, onClose }: Props) {
  const [reason, setReason] = useState('')
  const trimmed = reason.trim()

  return (
    <Modal title="Flag for changes" onClose={onClose}>
      <p className="text-sm text-salt-text-sec mb-3">
        Say what does not match between this request and the items. The guest is
        told their request needs checking, but not what you write here.
      </p>
      <textarea
        rows={3}
        value={reason}
        onChange={(event) => setReason(event.target.value.slice(0, MAX_REASON))}
        placeholder="e.g. 4 shirts in the bag, 3 on the list"
        className="w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-base sm:text-sm bg-white focus:outline-none focus:border-salt-navy"
      />
      <p className="text-[11px] text-salt-text-muted mt-1">
        {reason.length}/{MAX_REASON}
      </p>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="border border-[0.5px] border-salt-border rounded-lg px-4 py-2 text-sm text-salt-text"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSubmit(trimmed)}
          disabled={trimmed.length < 5 || isSaving}
          className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-4 py-2 text-sm disabled:opacity-60"
        >
          {isSaving ? 'Flagging…' : 'Flag for changes'}
        </button>
      </div>
    </Modal>
  )
}
