'use client'

import { useRouter } from 'next/navigation'
import { UserCog } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ExpressBadge } from '@/components/ui/ExpressBadge'
import { OverdueBadge } from '@/components/staff/OverdueBadge'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { timeAgo, summarizeItemNames } from '@/lib/utils/formatting'
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
  const goToDetail = () => router.push(`/staff/requests/${id}`)
  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToDetail() } }
  return (
    <div
      id={`request-${id}`} role="button" tabIndex={0}
      onClick={goToDetail} onKeyDown={onKey}
      className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm px-5 py-4 mb-3 cursor-pointer hover:border-salt-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-salt-navy transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
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
        <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
          {awaitingAck && (
            <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full whitespace-nowrap">
              Awaiting acknowledgment
            </span>
          )}
          <OverdueBadge request={request} />
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-salt-border">
        <span className="text-xs text-salt-text-muted">
          Assigned to: {assignedTo?.name ?? 'Unassigned'}
        </span>
        <div className="flex items-center gap-2">
          {!assignedTo && <span className="text-xs text-amber-600">⚠ Unassigned</span>}
          {canReassign && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onReassign(request) }}
              className="flex items-center gap-1 text-salt-navy text-xs border border-[0.5px] border-salt-border rounded-lg px-2.5 py-1 hover:bg-salt-cream transition-colors"
            >
              <UserCog className="w-3 h-3" />Reassign
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
