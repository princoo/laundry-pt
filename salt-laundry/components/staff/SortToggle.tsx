import { ArrowDownUp } from 'lucide-react'
import { SORT_LABELS, type SortOrder } from '@/lib/constants/queue'

interface Props {
  sort: SortOrder
  onChange: (sort: SortOrder) => void
}

export function SortToggle({ sort, onChange }: Props) {
  return (
    <button
      type="button"
      onClick={() => onChange(sort === 'desc' ? 'asc' : 'desc')}
      className="flex items-center gap-1.5 shrink-0 text-sm text-salt-text-sec border border-[0.5px] border-salt-border rounded-lg px-3 py-1.5 bg-white hover:text-salt-text hover:bg-salt-cream transition-colors"
    >
      <ArrowDownUp className="w-3.5 h-3.5" />
      {SORT_LABELS[sort]}
    </button>
  )
}
