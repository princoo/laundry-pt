import { Check } from 'lucide-react'
import { ACTIVE_STATUSES, STATUS_LABELS } from '@/lib/constants/statuses'
import { formatEventTimestamp } from '@/lib/utils/formatting'
import type { RequestStatus } from '@prisma/client'

interface Props {
  status: RequestStatus
  collectedAt: string | null
  completedAt: string | null
  returnedAt: string | null
}

export function StatusStepper({ status, collectedAt, completedAt, returnedAt }: Props) {
  if (status === 'CANCELLED') {
    return <p className="text-sm text-salt-text-muted">This request was cancelled.</p>
  }

  const timestampByStatus: Partial<Record<RequestStatus, { label: string; value: string | null }>> = {
    COLLECTED: { label: 'Collected at', value: collectedAt },
    READY: { label: 'Completed at', value: completedAt },
    DELIVERED: { label: 'Returned at', value: returnedAt },
  }

  const currentIndex = ACTIVE_STATUSES.indexOf(status)
  const currentTimestamp = timestampByStatus[status]

  const labelClass = (index: number) => {
    if (index === currentIndex) return 'text-salt-navy font-medium'
    if (index < currentIndex) return 'text-salt-text-sec'
    return 'text-salt-text-muted'
  }

  return (
    <div>
      <div className="flex items-start">
        {ACTIVE_STATUSES.map((step, index) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center w-16">
              <div
                className={`w-8 h-8 rounded-full border border-[0.5px] flex items-center justify-center ${
                  index <= currentIndex
                    ? 'bg-salt-navy border-salt-navy'
                    : 'bg-white border-salt-border'
                }`}
              >
                {index < currentIndex && <Check className="w-3.5 h-3.5 text-white" />}
                {index === currentIndex && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className={`text-[11px] mt-1.5 text-center ${labelClass(index)}`}>
                {STATUS_LABELS[step]}
              </span>
            </div>
            {index < ACTIVE_STATUSES.length - 1 && (
              <div className="flex-1 border-t border-[0.5px] border-salt-border mx-1 mt-4" />
            )}
          </div>
        ))}
      </div>

      {currentTimestamp?.value && (
        <div className="text-center text-xs text-salt-text-sec mt-3">
          {currentTimestamp.label} {formatEventTimestamp(currentTimestamp.value)}
        </div>
      )}
    </div>
  )
}
