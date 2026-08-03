import { Clock } from 'lucide-react'

interface Props {
  count: number
  onView: () => void
}

export function UnacknowledgedBanner({ count, onView }: Props) {
  if (count === 0) return null

  return (
    <div className="bg-amber-50 border border-[0.5px] border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-sm text-amber-800">
        <Clock className="w-4 h-4 shrink-0" />
        You have {count} request{count === 1 ? '' : 's'} awaiting your acknowledgment.
      </span>
      <button
        type="button"
        onClick={onView}
        className="bg-amber-500 text-white rounded-lg px-3 py-1.5 text-sm shrink-0"
      >
        View
      </button>
    </div>
  )
}
