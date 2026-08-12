import { StatusBadge } from '@/components/ui/StatusBadge'
import { HOTEL_TIMEZONE } from '@/lib/constants/timezone'
import { ExpressBadge } from '@/components/ui/ExpressBadge'
import { getServiceLabel } from '@/lib/utils/serviceSummary'
import { formatCurrency } from '@/lib/utils/formatting'
import type { SearchResult } from '@/lib/hooks/useSearchRequests'

interface Props {
  request: SearchResult
  onClick: () => void
}

export function SearchResultCard({ request, onClick }: Props) {
  const { roomNumber, guestName, serviceTypes, isExpress, status, totalAmount, createdAt, totalItems } = request
  const date = new Date(createdAt)
  const day = date.toLocaleDateString('en-RW', {
    day: 'numeric', month: 'short', timeZone: HOTEL_TIMEZONE,
  })
  const time = date.toLocaleTimeString('en-RW', {
    hour: '2-digit', minute: '2-digit', timeZone: HOTEL_TIMEZONE,
  })

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
        {getServiceLabel(serviceTypes)}
        {isExpress && <ExpressBadge />}
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-[0.5px] border-salt-border text-sm">
        <span className="text-salt-text-muted">{day}, {time} · {totalItems} item{totalItems === 1 ? '' : 's'}</span>
        <span className="font-medium text-salt-text">{formatCurrency(totalAmount)}</span>
      </div>
    </button>
  )
}
