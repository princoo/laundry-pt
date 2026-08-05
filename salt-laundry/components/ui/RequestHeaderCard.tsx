import { StatusBadge } from '@/components/ui/StatusBadge'
import type { RequestDetail } from '@/lib/types/request'

interface Props {
  request: RequestDetail
  reference?: string
}

export function RequestHeaderCard({ request, reference }: Props) {
  const { roomNumber, guestName, status, isExpress, isHanger, note } = request

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <div className="text-2xl sm:text-[26px] font-medium text-salt-text leading-tight">Room {roomNumber}</div>
          {guestName && <div className="text-sm text-salt-text-sec mt-1">{guestName}</div>}
          {reference && (
            <div className="text-xs text-salt-text-muted mt-1 font-mono">{reference}</div>
          )}
        </div>
        <StatusBadge status={status} size="md" />
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mt-4 text-[13px] text-salt-text-sec">
        {/* No single service here — it's per item, shown in the breakdown.
            Express stays: it's request-level. */}
        <span>{isExpress ? 'Express' : 'Standard'}</span>
        <span className="text-salt-text-muted">·</span>
        <span>{isHanger ? 'Hanger' : 'Folded'}</span>
      </div>

      {note && (
        <div className="bg-salt-cream rounded-lg px-4 py-3 mt-4">
          <div className="text-[11px] uppercase text-salt-text-muted">Guest note</div>
          <div className="text-[13px] text-salt-text mt-1">{note}</div>
        </div>
      )}
    </div>
  )
}
