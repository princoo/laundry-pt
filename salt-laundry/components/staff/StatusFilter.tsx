import { STATUS_LABELS } from '@/lib/constants/statuses'

const FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: STATUS_LABELS.PENDING },
  { value: 'COLLECTED', label: STATUS_LABELS.COLLECTED },
  { value: 'IN_PROGRESS', label: STATUS_LABELS.IN_PROGRESS },
  { value: 'READY', label: STATUS_LABELS.READY },
]

interface Props {
  active: string
  onChange: (value: string) => void
}

export function StatusFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={
            active === value
              ? 'bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-full px-4 py-1.5 text-sm whitespace-nowrap'
              : 'text-salt-text-sec px-4 py-1.5 text-sm whitespace-nowrap hover:text-salt-text'
          }
        >
          {label}
        </button>
      ))}
    </div>
  )
}
