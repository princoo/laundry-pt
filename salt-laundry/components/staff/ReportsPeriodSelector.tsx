'use client'

import { QUICK_RANGES, type QuickRange } from '@/lib/hooks/useReports'

const inputClasses =
  'border border-[0.5px] border-salt-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-salt-navy bg-white'

interface Props {
  from: string
  to: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onGenerate: () => void
  onQuickRange: (quick: QuickRange) => void
  isLoading: boolean
}

export function ReportsPeriodSelector({
  from, to, onFromChange, onToChange, onGenerate, onQuickRange, isLoading,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-salt-text-muted mb-1">From</label>
          <input type="date" value={from} onChange={(e) => onFromChange(e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className="block text-xs text-salt-text-muted mb-1">To</label>
          <input type="date" value={to} onChange={(e) => onToChange(e.target.value)} className={inputClasses} />
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2 text-sm font-medium disabled:opacity-60"
        >
          {isLoading ? 'Generating…' : 'Generate report'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {QUICK_RANGES.map((quick) => (
          <button
            key={quick}
            type="button"
            onClick={() => onQuickRange(quick)}
            className="text-xs text-salt-text-sec border border-[0.5px] border-salt-border rounded-full px-3 py-1 hover:border-salt-navy hover:text-salt-navy transition-colors"
          >
            {quick}
          </button>
        ))}
      </div>
    </div>
  )
}
