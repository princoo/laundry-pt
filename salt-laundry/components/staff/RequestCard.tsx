'use client'

import { useRouter } from 'next/navigation'
import { UserCog } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PermissionGate } from '@/components/ui/PermissionGate'
import { ExpressBadge } from '@/components/ui/ExpressBadge'
import { OverdueBadge } from '@/components/staff/OverdueBadge'
import { getServiceLabel } from '@/lib/utils/serviceSummary'
import { timeAgo, summarizeItemNames } from '@/lib/utils/formatting'
import { assignmentSummary } from '@/lib/utils/assignmentSummary'
import type { QueueRequest } from '@/lib/hooks/useStaffDashboard'

interface Props {
  request: QueueRequest
  // Set on a housekeeper's own queue. They already know the task is theirs,
  // so the footer trades their own name for when it landed on them.
  isMyTask?: boolean
  onReassign?: (request: QueueRequest) => void
}

export function RequestCard({ request, isMyTask, onReassign }: Props) {
  const router = useRouter()
  const {
    id, reference, roomNumber, guestName, serviceTypes, isExpress,
    status, createdAt, totalItems, itemNames, assignedTo, assignedAt,
  } = request
  const assignmentLabel = assignmentSummary(!!isMyTask, assignedTo, assignedAt)
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
            <span>
              {getServiceLabel(serviceTypes)} · {totalItems} items · Submitted {timeAgo(createdAt)}
            </span>
          </div>
          {itemNames.length > 0 && (
            <div className="text-xs text-salt-text-sec mt-1">{summarizeItemNames(itemNames)}</div>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
          <OverdueBadge request={request} />
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-salt-border">
        <span className="text-xs text-salt-text-muted">{assignmentLabel}</span>
        <div className="flex items-center gap-2">
          {onReassign && (
            <PermissionGate permission="LAUNDRY_REQUEST_HOUSEKEEPER_ASSIGN">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onReassign(request) }}
                className="flex items-center gap-1 text-salt-navy text-xs border border-[0.5px] border-salt-border rounded-lg px-2.5 py-1 hover:bg-salt-cream transition-colors"
              >
                <UserCog className="w-3 h-3" />{assignedTo ? 'Reassign' : 'Assign'}
              </button>
            </PermissionGate>
          )}
        </div>
      </div>
    </div>
  )
}
