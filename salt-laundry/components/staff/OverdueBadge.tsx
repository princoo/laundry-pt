import { AlertTriangle } from 'lucide-react'
import { getAlertLevel } from '@/lib/utils/sla'
import { ALERT_LABELS, ALERT_BADGE_CLASSES } from '@/lib/constants/alerts'
import type { RequestStatus, ServiceType } from '@prisma/client'

interface Props {
  request: {
    status:       RequestStatus
    serviceType:  ServiceType
    isExpress:    boolean
    createdAt:    Date | string
    completedAt?: Date | string | null
  }
}

export function OverdueBadge({ request }: Props) {
  const level = getAlertLevel(request)
  if (!level) return null

  return (
    <span className={`${ALERT_BADGE_CLASSES[level]} flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap`}>
      <AlertTriangle className="w-3 h-3" /> {ALERT_LABELS[level]}
    </span>
  )
}
