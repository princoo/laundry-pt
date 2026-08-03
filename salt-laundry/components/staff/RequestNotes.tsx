'use client'

import { useRequestNotes } from '@/lib/hooks/useRequestNotes'
import { formatTimestamp } from '@/lib/utils/formatting'
import type { RequestNote } from '@/lib/types/request'

interface Props {
  requestId: string
  initialNotes: RequestNote[]
}

const MAX_LENGTH = 500

export function RequestNotes({ requestId, initialNotes }: Props) {
  const { notes, newNote, setNewNote, isSubmitting, error, submitNote } =
    useRequestNotes(requestId, initialNotes)

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-6">
      <div className="text-[11px] uppercase text-salt-text-muted mb-4">Staff notes</div>

      <div className="space-y-2 mb-4">
        {notes.length === 0 && (
          <p className="text-sm text-salt-text-muted">No notes yet.</p>
        )}
        {notes.map((note, index) => (
          <div
            key={note.id}
            className={`bg-salt-cream rounded-lg px-4 py-3 ${
              index > 0 ? 'border-t border-[0.5px] border-salt-border' : ''
            }`}
          >
            <p className="text-sm text-salt-text">{note.content}</p>
            <p className="text-[11px] text-salt-text-muted mt-1">
              {formatTimestamp(note.createdAt)}
            </p>
          </div>
        ))}
      </div>

      <textarea
        rows={3}
        value={newNote}
        maxLength={MAX_LENGTH}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Add a note for this request…"
        className="w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-salt-navy bg-white"
      />
      <div className="flex justify-end mt-1">
        <span className="text-xs text-salt-text-muted">{newNote.length}/{MAX_LENGTH}</span>
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <button
        onClick={submitNote}
        disabled={!newNote.trim() || isSubmitting}
        className="mt-2 bg-salt-navy text-white text-sm px-4 py-2 rounded-lg disabled:opacity-40"
      >
        Add note
      </button>
    </div>
  )
}
