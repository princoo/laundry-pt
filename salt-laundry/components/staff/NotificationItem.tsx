import { ExpressBadge } from '@/components/ui/ExpressBadge'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { NOTIFICATION_KIND_LABELS, NOTIFICATION_KIND_CLASSES } from '@/lib/constants/notifications'
import { formatCurrency, timeAgo } from '@/lib/utils/formatting'
import type { StaffNotification } from '@/lib/hooks/useNotifications'

interface Props {
  notification: StaffNotification
  onSelect: (id: string) => void
}

export function NotificationItem({ notification, onSelect }: Props) {
  const { id, kind, roomNumber, guestName, serviceType, isExpress, totalAmount, timestamp } = notification
  const kindLabel = NOTIFICATION_KIND_LABELS[kind]

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="w-full text-left px-4 py-3 border-b border-[0.5px] border-salt-border last:border-b-0 hover:bg-salt-cream transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {kindLabel && (
            <div className={`text-[11px] font-medium mb-0.5 ${NOTIFICATION_KIND_CLASSES[kind]}`}>
              {kindLabel}
            </div>
          )}
          <div className="text-sm font-medium text-salt-text truncate">
            Room {roomNumber}
            {guestName && <span className="font-normal text-salt-text-sec"> — {guestName}</span>}
          </div>
          <div className="text-xs text-salt-text-muted mt-0.5 flex items-center gap-1.5">
            {isExpress && <ExpressBadge />}
            <span>{SERVICE_TYPE_LABELS[serviceType]}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm text-salt-text">{formatCurrency(totalAmount)}</div>
          <div className="text-xs text-salt-text-muted">{timeAgo(timestamp)}</div>
        </div>
      </div>
    </button>
  )
}
