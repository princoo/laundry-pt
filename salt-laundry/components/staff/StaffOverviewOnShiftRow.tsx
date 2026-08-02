interface Props {
  name: string | null
  activeTaskCount: number
  onViewTasks: () => void
  onMarkOffShift: () => void
}

export function StaffOverviewOnShiftRow({
  name, activeTaskCount, onViewTasks, onMarkOffShift,
}: Props) {
  return (
    <div className="flex items-center justify-between py-2 text-sm gap-3">
      <span className="flex items-center gap-2 flex-1 min-w-0 truncate">
        <span className="w-2 h-2 rounded-full bg-salt-green shrink-0" />
        {name}
      </span>
      <span className="text-salt-text-sec whitespace-nowrap">{activeTaskCount} active</span>
      <button
        type="button"
        onClick={onViewTasks}
        className="text-salt-navy text-xs underline whitespace-nowrap"
      >
        View tasks
      </button>
      <button
        type="button"
        onClick={onMarkOffShift}
        className="text-amber-600 text-xs underline whitespace-nowrap"
      >
        Mark off shift
      </button>
    </div>
  )
}
