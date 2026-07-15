import { PackageOpen } from 'lucide-react'
import { STATUS_LABELS } from '@/lib/constants/statuses'
import type { RequestStatus } from '@prisma/client'

interface Props {
  filter: string
}

export function EmptyQueue({ filter }: Props) {
  const label = filter === 'ALL' ? '' : `${STATUS_LABELS[filter as RequestStatus].toLowerCase()} `

  return (
    <div className="text-center mt-12">
      <PackageOpen className="w-10 h-10 text-salt-text-muted mx-auto mb-3" />
      <p className="text-base text-salt-text-sec">No {label}requests</p>
      {filter === 'ALL' && (
        <p className="text-sm text-salt-text-muted mt-1">No requests yet today.</p>
      )}
    </div>
  )
}
