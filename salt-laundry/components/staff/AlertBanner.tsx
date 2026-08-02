import { AlertTriangle } from 'lucide-react'
import { getAlertLevel, getReturnDeadline } from '@/lib/utils/sla'
import { ALERT_LABELS, ALERT_DESCRIPTIONS, ALERT_BANNER_CLASSES } from '@/lib/constants/alerts'
import { formatEventTimestamp } from '@/lib/utils/formatting'
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

export function AlertBanner({ request }: Props) {
  const level = getAlertLevel(request)
  if (!level) return null

  const deadline = getReturnDeadline(request.serviceType, request.isExpress)

  return (
    <div className={`${ALERT_BANNER_CLASSES[level]} border rounded-xl px-5 py-3 mb-4 flex items-start gap-2`}>
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
      <div>
        <div className="text-sm font-medium">{ALERT_LABELS[level]}</div>
        <div className="text-xs mt-0.5">{ALERT_DESCRIPTIONS[level]} Return deadline: {formatEventTimestamp(deadline)}.</div>
      </div>
    </div>
  )
}
