interface Props {
  name: string | null
  onMarkOnShift: () => void
}

export function StaffOverviewOffShiftRow({ name, onMarkOnShift }: Props) {
  return (
    <div className="flex items-center justify-between py-2 text-sm gap-3">
      <span className="flex items-center gap-2 flex-1 min-w-0 truncate text-salt-text-muted">
        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
        {name}
      </span>
      <button
        type="button"
        onClick={onMarkOnShift}
        className="text-salt-navy text-xs underline whitespace-nowrap"
      >
        Mark as on shift
      </button>
    </div>
  )
}
