'use client'

import { Modal } from '@/components/ui/Modal'
import { useHousekeepers } from '@/lib/hooks/useHousekeepers'
import { useReassignRequest } from '@/lib/hooks/useReassignRequest'

interface Props {
  requestId: string
  currentAssigneeId: string | null
  currentAssigneeName?: string | null
  onClose: () => void
  onReassigned: () => void
}

export function ReassignModal({
  requestId, currentAssigneeId, currentAssigneeName, onClose, onReassigned,
}: Props) {
  const housekeepers = useHousekeepers()
  const { selectedId, setSelectedId, note, setNote, isSubmitting, error, submit } =
    useReassignRequest(requestId, onReassigned, onClose)
  const options = housekeepers.filter((h) => h.id !== currentAssigneeId)

  return (
    <Modal title="Reassign request" onClose={onClose}>
      <p className="text-sm text-salt-text-sec mb-3">
        Currently assigned: {currentAssigneeName ?? 'Unassigned'}
      </p>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm bg-white mb-3"
      >
        <option value="">Select a housekeeper…</option>
        {options.map((h) => (
          <option key={h.id} value={h.id}>{h.name ?? h.email}</option>
        ))}
      </select>
      <p className="text-[11px] text-salt-text-muted mb-3">
        Only showing housekeepers currently on shift.
      </p>
      <textarea
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Reason for reassignment (optional)"
        className="w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm bg-white"
      />
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
          onClick={submit}
          disabled={!selectedId || isSubmitting}
          className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-4 py-2 text-sm disabled:opacity-60"
        >
          {isSubmitting ? 'Reassigning…' : 'Reassign'}
        </button>
      </div>
    </Modal>
  )
}
