import { QUEUE_STATUS_FILTERS, STATUS_LABELS } from '@/lib/constants/statuses'
import type { RequestStatus } from '@prisma/client'

interface Props {
  active: string
  onChange: (value: string) => void
  options?: readonly string[]
}

export function StatusFilter({ active, onChange, options = QUEUE_STATUS_FILTERS }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {options.map((value) => (
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
          {value === 'ALL' ? 'All' : STATUS_LABELS[value as RequestStatus]}
        </button>
      ))}
    </div>
  )
}
