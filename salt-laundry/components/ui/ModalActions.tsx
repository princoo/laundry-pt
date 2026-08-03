interface Props {
  onCancel: () => void
  isSubmitting: boolean
  submitLabel: string
  pendingLabel: string
}

export function ModalActions({ onCancel, isSubmitting, submitLabel, pendingLabel }: Props) {
  return (
    <div className="flex justify-end gap-2 mt-2">
      <button
        type="button"
        onClick={onCancel}
        className="border border-[0.5px] border-salt-border rounded-lg px-4 py-2 text-sm text-salt-text"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-4 py-2 text-sm disabled:opacity-60"
      >
        {isSubmitting ? pendingLabel : submitLabel}
      </button>
    </div>
  )
}
