import { X } from 'lucide-react'

export interface SubmissionProps {
  isSubmitting: boolean
  submitError: string | null
  onSubmit: () => void
  onDismissError: () => void
}

interface Props extends SubmissionProps {
  canSubmit: boolean
}

export function SubmitSection({
  canSubmit,
  isSubmitting,
  submitError,
  onSubmit,
  onDismissError,
}: Props) {
  return (
    <>
      {submitError && (
        <div className="bg-red-50 border border-[0.5px] border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 flex items-start justify-between gap-3">
          <span>{submitError}</span>
          <button type="button" onClick={onDismissError} className="text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <button
        type="button"
        disabled={!canSubmit || isSubmitting}
        onClick={onSubmit}
        className="hidden md:flex w-full bg-salt-green hover:bg-salt-green-hover transition-colors text-white rounded-lg py-3 font-medium disabled:cursor-not-allowed items-center justify-center gap-2"
      >
        {isSubmitting && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {isSubmitting ? 'Submitting…' : 'Submit request'}
      </button>

      {!canSubmit && !isSubmitting && (
        <p className="hidden md:block text-xs text-salt-text-muted text-center">
          Enter your room number and select at least one item.
        </p>
      )}
    </>
  )
}
