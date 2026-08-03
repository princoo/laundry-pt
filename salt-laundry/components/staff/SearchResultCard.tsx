import { StatusBadge } from '@/components/ui/StatusBadge'
import { ExpressBadge } from '@/components/ui/ExpressBadge'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { formatCurrency } from '@/lib/utils/formatting'
import type { SearchResult } from '@/lib/hooks/useSearchRequests'

interface Props {
  request: SearchResult
  onClick: () => void
}

export function SearchResultCard({ request, onClick }: Props) {
  const { roomNumber, guestName, serviceType, isExpress, status, totalAmount, createdAt, totalItems } = request
  const date = new Date(createdAt)
  const day = date.toLocaleDateString('en-RW', { day: 'numeric', month: 'short' })
  const time = date.toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' })

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 flex flex-col gap-2.5 active:bg-salt-cream transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-medium text-salt-text">Room {roomNumber}</div>
          <div className="text-sm text-salt-text-sec">{guestName || '—'}</div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center gap-1.5 text-sm text-salt-text-sec">
        {SERVICE_TYPE_LABELS[serviceType]}
        {isExpress && <ExpressBadge />}
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-[0.5px] border-salt-border text-sm">
        <span className="text-salt-text-muted">{day}, {time} · {totalItems} item{totalItems === 1 ? '' : 's'}</span>
        <span className="font-medium text-salt-text">{formatCurrency(totalAmount)}</span>
      </div>
    </button>
  )
}
