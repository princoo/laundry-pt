import { formatCurrency } from '@/lib/utils/formatting'

interface Props {
  total: number
  canSubmit: boolean
  isSubmitting: boolean
  onSubmit: () => void
}

export function MobileSubmitBar({ total, canSubmit, isSubmitting, onSubmit }: Props) {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[0.5px] border-salt-border px-4 py-3 flex items-center justify-between gap-4 z-40">
      <div>
        <p className="text-[11px] text-salt-text-muted">Total</p>
        <p className="text-[16px] font-medium text-salt-navy">{formatCurrency(total)}</p>
      </div>
      <button
        type="button"
        disabled={!canSubmit || isSubmitting}
        onClick={onSubmit}
        className="bg-salt-green hover:bg-salt-green-hover transition-colors text-white rounded-lg px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
      >
        {isSubmitting && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {isSubmitting ? 'Submitting…' : 'Submit request'}
      </button>
    </div>
  )
}
