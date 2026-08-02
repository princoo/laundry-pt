import Link from 'next/link'
import { NotificationItem } from '@/components/staff/NotificationItem'
import type { StaffNotification } from '@/lib/hooks/useNotifications'

interface Props {
  notifications: StaffNotification[]
  showPermissionRow: boolean
  onRequestPermission: () => void
  onSelect: (id: string) => void
}

export function NotificationDropdown({
  notifications, showPermissionRow, onRequestPermission, onSelect,
}: Props) {
  return (
    <div className="absolute right-0 top-12 w-80 bg-white border border-[0.5px] border-salt-border rounded-xl shadow-lg z-50">
      {showPermissionRow && (
        <button
          type="button"
          onClick={onRequestPermission}
          className="w-full text-left px-4 py-2.5 text-xs text-salt-navy bg-salt-green-light border-b border-[0.5px] border-salt-border rounded-t-xl"
        >
          Enable desktop notifications
        </button>
      )}

      <div className="px-4 py-3 border-b border-[0.5px] border-salt-border">
        <span className="text-[11px] uppercase tracking-wide text-salt-text-muted">
          Recent requests
        </span>
      </div>

      {notifications.length === 0 ? (
        <p className="px-4 py-8 text-sm text-salt-text-muted text-center">No new requests yet.</p>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onSelect={onSelect} />
          ))}
        </div>
      )}

      <Link
        href="/staff"
        className="block px-4 py-3 text-sm text-salt-navy border-t border-[0.5px] border-salt-border"
      >
        View all requests →
      </Link>
    </div>
  )
}
