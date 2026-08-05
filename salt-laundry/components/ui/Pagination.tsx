import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPageRange } from '@/lib/utils/pagination'

interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const STEP_CLASSES =
  'flex items-center gap-1 text-sm text-salt-text rounded-lg px-3 py-1.5 hover:bg-salt-cream disabled:opacity-40 disabled:hover:bg-transparent transition-colors'

const SLOT_CLASSES = 'min-w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors'

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 pt-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={STEP_CLASSES}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {getPageRange(page, totalPages).map((token, index) =>
        token === 'gap' ? (
          <span
            key={`gap-${index}`}
            aria-hidden="true"
            className={`${SLOT_CLASSES} text-salt-text-muted`}
          >
            …
          </span>
        ) : (
          <button
            key={token}
            type="button"
            onClick={() => onChange(token)}
            aria-label={`Page ${token}`}
            aria-current={token === page ? 'page' : undefined}
            className={`${SLOT_CLASSES} ${
              token === page
                ? 'border border-[0.5px] border-salt-navy text-salt-navy font-medium'
                : 'text-salt-text-sec hover:bg-salt-cream hover:text-salt-text'
            }`}
          >
            {token}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className={STEP_CLASSES}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}
