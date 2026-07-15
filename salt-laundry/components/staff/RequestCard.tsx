'use client'

import { useRouter } from 'next/navigation'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ExpressBadge } from '@/components/ui/ExpressBadge'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { timeAgo, summarizeItemNames } from '@/lib/utils/formatting'
import type { QueueRequest } from '@/lib/hooks/useStaffDashboard'

interface Props {
  request: QueueRequest
}

export function RequestCard({ request }: Props) {
  const router = useRouter()
  const {
    id, reference, roomNumber, guestName, serviceType, isExpress,
    status, createdAt, totalItems, itemNames,
  } = request

  return (
    <div
      onClick={() => router.push(`/staff/requests/${id}`)}
      className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm px-5 py-4 mb-3 cursor-pointer hover:border-salt-navy transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-medium text-salt-text">
            Room {roomNumber}
            {guestName ? ` — ${guestName}` : ''}
          </div>
          <div className="text-xs text-salt-text-muted font-mono">{reference}</div>
          <div className="text-xs text-salt-text-muted mt-0.5 flex items-center gap-1.5">
            {isExpress && <ExpressBadge />}
            <span>
              {SERVICE_TYPE_LABELS[serviceType]} · {totalItems} items · {timeAgo(createdAt)}
            </span>
          </div>
          {itemNames.length > 0 && (
            <div className="text-xs text-salt-text-sec mt-1">
              {summarizeItemNames(itemNames)}
            </div>
          )}
        </div>
        <StatusBadge status={status} />
      </div>
    </div>
  )
}
