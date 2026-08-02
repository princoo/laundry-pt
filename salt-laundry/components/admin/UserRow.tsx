import { getInitials } from '@/lib/utils/formatting'
import { ActiveToggle } from '@/components/ui/ActiveToggle'
import type { AdminUser } from '@/lib/hooks/useAdminUsers'

interface Props {
  user: AdminUser
  onEdit: (user: AdminUser) => void
  onToggleAvailability: (id: string, nextIsAvailable: boolean) => void
}

function RoleBadge({ role }: { role: AdminUser['role'] }) {
  if (role === 'ADMIN') {
    return (
      <span className="bg-salt-navy text-white text-xs px-2.5 py-1 rounded-full">Admin</span>
    )
  }
  if (role === 'SUPERVISOR') {
    return (
      <span className="bg-salt-green text-white text-xs px-2.5 py-1 rounded-full">Supervisor</span>
    )
  }
  return (
    <span className="bg-salt-cream text-salt-text-sec text-xs px-2.5 py-1 rounded-full">Housekeeper</span>
  )
}

export function UserRow({ user, onEdit, onToggleAvailability }: Props) {
  return (
    <tr className="border-b border-[0.5px] border-salt-border last:border-0">
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-salt-green-light text-salt-green text-xs font-medium flex items-center justify-center">
            {getInitials(user.name, user.email)}
          </div>
          <span className="text-salt-text">{user.name || user.email}</span>
        </div>
      </td>
      <td className="py-4 px-5 text-sm text-salt-text-sec">{user.email}</td>
      <td className="py-4 px-5">
        <RoleBadge role={user.role} />
      </td>
      <td className="py-4 px-5">
        {user.isActive ? (
          <span className="text-salt-green text-sm">Active</span>
        ) : (
          <span className="text-salt-text-muted text-sm">Inactive</span>
        )}
      </td>
      <td className="py-4 px-5">
        {user.role === 'HOUSEKEEPER' ? (
          <div className="flex items-center gap-2">
            <ActiveToggle
              checked={user.isAvailable}
              onChange={() => onToggleAvailability(user.id, !user.isAvailable)}
              offColorClass="bg-amber-400"
            />
            <span className="text-xs text-salt-text-sec">
              {user.isAvailable ? 'On shift' : 'Off shift'}
            </span>
          </div>
        ) : (
          <span className="text-salt-text-muted text-sm">—</span>
        )}
      </td>
      <td className="py-4 px-5">
        <button type="button" onClick={() => onEdit(user)} className="text-salt-navy text-sm underline">
          Edit
        </button>
      </td>
    </tr>
  )
}
