import { StatusBadge } from '@/components/ui/StatusBadge'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import type { RequestDetail } from '@/lib/types/request'

interface Props {
  request: RequestDetail
  reference?: string
}

export function RequestHeaderCard({ request, reference }: Props) {
  const { roomNumber, guestName, status, serviceType, isExpress, isHanger, note } = request

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[22px] font-medium text-salt-text">Room {roomNumber}</div>
          {guestName && <div className="text-sm text-salt-text-sec mt-0.5">{guestName}</div>}
          {reference && (
            <div className="text-xs text-salt-text-muted mt-1 font-mono">{reference}</div>
          )}
        </div>
        <StatusBadge status={status} size="md" />
      </div>

      <div className="flex gap-4 mt-4 text-[13px] text-salt-text-sec">
        <span>{SERVICE_TYPE_LABELS[serviceType]}</span>
        <span>Express: {isExpress ? 'Yes' : 'No'}</span>
        <span>{isHanger ? 'Hanger' : 'Folded'}</span>
      </div>

      {note && (
        <div className="bg-salt-cream rounded-lg px-4 py-3 mt-4">
          <div className="text-[11px] uppercase text-salt-text-muted">Guest note:</div>
          <div className="text-[13px] text-salt-text mt-1">{note}</div>
        </div>
      )}
    </div>
  )
}
