import { getInitials } from '@/lib/utils/formatting'
import type { AdminUser } from '@/lib/hooks/useAdminUsers'

interface Props {
  user: AdminUser
  onEdit: (user: AdminUser) => void
}

function RoleBadge({ role }: { role: AdminUser['role'] }) {
  if (role === 'ADMIN') {
    return (
      <span className="bg-salt-navy text-white text-xs px-2.5 py-1 rounded-full">Admin</span>
    )
  }
  return (
    <span className="bg-salt-cream text-salt-text-sec text-xs px-2.5 py-1 rounded-full">Staff</span>
  )
}

export function UserRow({ user, onEdit }: Props) {
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
        <button type="button" onClick={() => onEdit(user)} className="text-salt-navy text-sm underline">
          Edit
        </button>
      </td>
    </tr>
  )
}
