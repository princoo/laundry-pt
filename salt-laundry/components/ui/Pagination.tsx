import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const buttonClasses =
  'flex items-center gap-1 text-sm text-salt-text border border-[0.5px] border-salt-border rounded-lg px-3 py-1.5 bg-white hover:bg-salt-cream disabled:opacity-40 disabled:hover:bg-white transition-colors'

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between gap-3 pt-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={buttonClasses}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>
      <span className="text-xs text-salt-text-muted">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className={buttonClasses}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
