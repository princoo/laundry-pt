import { STATUS_BADGE_CLASSES, STATUS_LABELS } from '@/lib/constants/statuses'
import type { RequestStatus } from '@prisma/client'

interface Props {
  status: RequestStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const padding = size === 'md' ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs'
  return (
    <span className={`${STATUS_BADGE_CLASSES[status]} ${padding} font-medium rounded-full`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
