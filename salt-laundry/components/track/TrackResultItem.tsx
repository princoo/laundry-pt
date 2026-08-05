import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency, timeAgo } from '@/lib/utils/formatting'
import { GUEST_EDITABLE_STATUS } from '@/lib/constants/statuses'
import type { TrackedRequest } from '@/lib/types/request'

interface Props {
  request: TrackedRequest
  onSelect: (request: TrackedRequest) => void
}

export function TrackResultItem({ request, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(request)}
      className="w-full text-left bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 flex items-center justify-between hover:border-salt-navy transition-colors"
    >
      <div>
        <div className="text-sm font-medium text-salt-text font-mono">{request.reference}</div>
        <div className="text-xs text-salt-text-muted mt-0.5">
          {formatCurrency(request.totalAmount)} · {timeAgo(request.createdAt)}
          {/* Flagged here so the guest knows which one they can still change
              without opening every card. */}
          {request.status === GUEST_EDITABLE_STATUS && ' · Can still be edited'}
        </div>
      </div>
      <StatusBadge status={request.status} />
    </button>
  )
}
