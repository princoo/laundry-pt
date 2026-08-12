import { UserMinus } from 'lucide-react'

interface Props {
  name: string | null
  activeTaskCount: number
  // Absent when the viewer may see the roster but not manage shifts.
  onMarkOffShift?: () => void
}

export function StaffOverviewOnShiftRow({ name, activeTaskCount, onMarkOffShift }: Props) {
  return (
    <div className="flex items-center justify-between py-2 text-sm gap-3">
      <span className="flex items-center gap-2 flex-1 min-w-0 truncate">
        <span className="w-2 h-2 rounded-full bg-salt-green shrink-0" />
        {name}
      </span>
      <span className="text-salt-text-sec whitespace-nowrap">{activeTaskCount} active</span>
      {onMarkOffShift && (
        <button
          type="button"
          onClick={onMarkOffShift}
          aria-label="Mark off shift"
          title="Mark off shift"
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-[0.5px] border-salt-border text-amber-600 hover:bg-amber-50 transition-colors shrink-0"
        >
          <UserMinus className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
