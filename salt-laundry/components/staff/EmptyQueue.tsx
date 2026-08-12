import { PackageOpen } from 'lucide-react'
import { STATUS_LABELS } from '@/lib/constants/statuses'
import type { RequestStatus } from '@prisma/client'

interface Props {
  filter: string
  // Shown under the heading when nothing is filtered out, so each dashboard can
  // say why its list is empty. A housekeeper is waiting on a supervisor; a
  // supervisor is just waiting on guests.
  hint?: string
}

export function EmptyQueue({ filter, hint = 'No requests yet today.' }: Props) {
  const label = filter === 'ALL' ? '' : `${STATUS_LABELS[filter as RequestStatus].toLowerCase()} `

  return (
    <div className="text-center mt-12">
      <PackageOpen className="w-10 h-10 text-salt-text-muted mx-auto mb-3" />
      <p className="text-base text-salt-text-sec">No {label}requests</p>
      {filter === 'ALL' && (
        <p className="text-sm text-salt-text-muted mt-1">{hint}</p>
      )}
    </div>
  )
}
