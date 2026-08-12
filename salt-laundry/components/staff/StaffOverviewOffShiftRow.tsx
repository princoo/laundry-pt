import { UserPlus } from 'lucide-react'

interface Props {
  name: string | null
  // Absent when the viewer may see the roster but not manage shifts.
  onMarkOnShift?: () => void
}

export function StaffOverviewOffShiftRow({ name, onMarkOnShift }: Props) {
  return (
    <div className="flex items-center justify-between py-2 text-sm gap-3">
      <span className="flex items-center gap-2 flex-1 min-w-0 truncate text-salt-text-muted">
        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
        {name}
      </span>
      {onMarkOnShift && (
        <button
          type="button"
          onClick={onMarkOnShift}
          aria-label="Mark on shift"
          title="Mark on shift"
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-[0.5px] border-salt-border text-salt-navy hover:bg-salt-cream transition-colors shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
