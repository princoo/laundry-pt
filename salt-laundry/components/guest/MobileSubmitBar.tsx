import { formatCurrency } from '@/lib/utils/formatting'
import { SAVE_LABELS } from '@/lib/constants/requestForm'
import type { RequestFormMode } from '@/lib/types/guestOrder'

interface Props {
  mode: RequestFormMode
  total: number
  canSubmit: boolean
  isSaving: boolean
  onSubmit: () => void
}

export function MobileSubmitBar({ mode, total, canSubmit, isSaving, onSubmit }: Props) {
  const labels = SAVE_LABELS[mode]

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[0.5px] border-salt-border px-4 py-3 flex items-center justify-between gap-4 z-40">
      <div>
        <p className="text-[11px] text-salt-text-muted">Total</p>
        <p className="text-[16px] font-medium text-salt-navy">{formatCurrency(total)}</p>
      </div>
      <button
        type="button"
        disabled={!canSubmit || isSaving}
        onClick={onSubmit}
        className="bg-salt-green hover:bg-salt-green-hover transition-colors text-white rounded-lg px-6 py-3 font-medium flex items-center justify-center gap-2 min-h-[44px] disabled:cursor-not-allowed disabled:bg-salt-border disabled:text-salt-text-muted disabled:hover:bg-salt-border"
      >
        {isSaving && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {isSaving ? labels.pending : labels.idle}
      </button>
    </div>
  )
}
