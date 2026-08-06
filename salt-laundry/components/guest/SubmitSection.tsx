import { X } from 'lucide-react'
import { SAVE_LABELS, SUBMIT_HINTS } from '@/lib/constants/requestForm'
import type { RequestFormMode } from '@/lib/types/guestOrder'

export interface SubmissionProps {
  mode: RequestFormMode
  isRoomLocked: boolean
  isSaving: boolean
  saveError: string | null
  onSubmit: () => void
  onDismissError: () => void
}

interface Props extends SubmissionProps {
  canSubmit: boolean
}

export function SubmitSection({
  mode,
  isRoomLocked,
  canSubmit,
  isSaving,
  saveError,
  onSubmit,
  onDismissError,
}: Props) {
  const labels = SAVE_LABELS[mode]
  const hint = SUBMIT_HINTS[isRoomLocked ? 'roomKnown' : 'asksRoom']

  return (
    <>
      {saveError && (
        <div className="bg-red-50 border border-[0.5px] border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 flex items-start justify-between gap-3">
          <span>{saveError}</span>
          <button type="button" onClick={onDismissError} className="text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <button
        type="button"
        disabled={!canSubmit || isSaving}
        onClick={onSubmit}
        className="hidden md:flex w-full bg-salt-green hover:bg-salt-green-hover transition-colors text-white rounded-lg py-3 font-medium items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-salt-border disabled:text-salt-text-muted disabled:hover:bg-salt-border"
      >
        {isSaving && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {isSaving ? labels.pending : labels.idle}
      </button>

      {!canSubmit && !isSaving && (
        <p className="hidden md:block text-xs text-salt-text-muted text-center">{hint}</p>
      )}
    </>
  )
}
