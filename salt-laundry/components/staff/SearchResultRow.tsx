import { StatusBadge } from '@/components/ui/StatusBadge'
import { ExpressBadge } from '@/components/ui/ExpressBadge'
import { getServiceLabel } from '@/lib/utils/serviceSummary'
import { formatCurrency } from '@/lib/utils/formatting'
import type { SearchResult } from '@/lib/hooks/useSearchRequests'

interface Props {
  request: SearchResult
  onClick: () => void
}

export function SearchResultRow({ request, onClick }: Props) {
  const { roomNumber, guestName, serviceTypes, isExpress, status, totalAmount, createdAt, totalItems } = request
  const date = new Date(createdAt)
  const day = date.toLocaleDateString('en-RW', { day: 'numeric', month: 'short' })
  const time = date.toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' })

  return (
    <tr
      onClick={onClick}
      className="border-b border-[0.5px] border-salt-border last:border-0 cursor-pointer hover:bg-salt-cream transition-colors"
    >
      <td className="px-4 py-3">
        <div className="text-salt-text">{day}</div>
        <div className="text-xs text-salt-text-muted">{time}</div>
      </td>
      <td className="px-4 py-3 font-medium text-salt-text">{roomNumber}</td>
      <td className="px-4 py-3 text-salt-text-sec">{guestName || '—'}</td>
      <td className="px-4 py-3 text-salt-text-sec">
        <div className="flex items-center gap-1.5">
          {getServiceLabel(serviceTypes)}
          {isExpress && <ExpressBadge />}
        </div>
      </td>
      <td className="px-4 py-3 text-salt-text-sec">{totalItems}</td>
      <td className="px-4 py-3 text-salt-text">{formatCurrency(totalAmount)}</td>
      <td className="px-4 py-3"><StatusBadge status={status} /></td>
    </tr>
  )
}
