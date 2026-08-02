'use client'

import { useRouter } from 'next/navigation'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ExpressBadge } from '@/components/ui/ExpressBadge'
import { OverdueBadge } from '@/components/staff/OverdueBadge'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { timeAgo, summarizeItemNames } from '@/lib/utils/formatting'
import { getAlertLevel } from '@/lib/utils/sla'
import type { QueueRequest } from '@/lib/hooks/useStaffDashboard'
import type { Role } from '@prisma/client'

interface Props {
  request: QueueRequest
  role?: Role
  onReassign?: (request: QueueRequest) => void
}

export function RequestCard({ request, role, onReassign }: Props) {
  const router = useRouter()
  const {
    id, reference, roomNumber, guestName, serviceType, isExpress,
    status, createdAt, totalItems, itemNames, assignedTo, acknowledgedAt,
  } = request
  const canReassign = (role === 'SUPERVISOR' || role === 'ADMIN') && onReassign
  const awaitingAck = !acknowledgedAt && status === 'PENDING'
  const alertLevel = getAlertLevel(request)

  return (
    <div
      id={`request-${id}`}
      onClick={() => router.push(`/staff/requests/${id}`)}
      className={`bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm px-5 py-4 mb-3 cursor-pointer hover:border-salt-navy transition-colors ${alertLevel === 'deadline_missed' ? 'border-l-2 border-l-red-700' : alertLevel === 'at_risk' ? 'border-l-2 border-l-amber-400' : alertLevel ? 'border-l-2 border-l-red-400' : ''}`}
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
            <span>{SERVICE_TYPE_LABELS[serviceType]} · {totalItems} items · {timeAgo(createdAt)}</span>
          </div>
          {itemNames.length > 0 && (
            <div className="text-xs text-salt-text-sec mt-1">{summarizeItemNames(itemNames)}</div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5">
            {awaitingAck && (
              <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full whitespace-nowrap">
                Awaiting acknowledgment
              </span>
            )}
            <OverdueBadge request={request} />
            <StatusBadge status={status} />
          </div>
          {canReassign && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onReassign(request) }}
              className="text-salt-navy text-xs underline"
            >
              Reassign
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[0.5px] border-salt-border">
        <span className="text-xs text-salt-text-muted">
          Assigned to: {assignedTo?.name ?? 'Unassigned'}
        </span>
        {!assignedTo && <span className="text-xs text-amber-600">⚠ Unassigned</span>}
      </div>
    </div>
  )
}
