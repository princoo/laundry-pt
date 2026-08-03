'use client'

import { ALL_TIME_LABEL } from '@/lib/constants/invoiceFilters'
import { QUICK_RANGES, matchQuickRange, type QuickRange } from '@/lib/utils/dateRange'

export type InvoiceRange = QuickRange | typeof ALL_TIME_LABEL

const OPTIONS: InvoiceRange[] = [ALL_TIME_LABEL, ...QUICK_RANGES]

interface Props {
  from: string
  to: string
  onSelect: (range: InvoiceRange) => void
}

export function QuickRangeChips({ from, to, onSelect }: Props) {
  const active: InvoiceRange | null =
    !from && !to ? ALL_TIME_LABEL : matchQuickRange(from, to)

  return (
    <div className="flex flex-wrap gap-1.5">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={active === option}
          onClick={() => onSelect(option)}
          className={`text-xs rounded-full px-2.5 py-1 border border-[0.5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-salt-navy ${
            active === option
              ? 'bg-salt-navy border-salt-navy text-white'
              : 'bg-white text-salt-text-sec border-salt-border hover:border-salt-navy hover:text-salt-navy'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
