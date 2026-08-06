import { getInitials } from '@/lib/utils/formatting'
import { ActiveToggle } from '@/components/ui/ActiveToggle'
import { RoleBadge } from '@/components/admin/RoleBadge'
import { UserActions } from '@/components/admin/UserActions'
import { UserStatusDot } from '@/components/admin/UserStatusDot'
import type { AdminUser } from '@/lib/hooks/useAdminUsers'

interface Props {
  user: AdminUser
  isCurrentUser: boolean
  onEdit: (user: AdminUser) => void
  onResetPassword: (user: AdminUser) => void
  onToggleAvailability: (id: string, nextIsAvailable: boolean) => void
}

export function UserRow({
  user,
  isCurrentUser,
  onEdit,
  onResetPassword,
  onToggleAvailability,
}: Props) {
  return (
    <tr className="border-b border-[0.5px] border-salt-border last:border-0 hover:bg-salt-cream transition-colors">
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 rounded-full bg-salt-green-light text-salt-green text-xs font-medium flex items-center justify-center">
            {getInitials(user.name, user.email)}
          </div>
          <span className="text-salt-text">
            {user.name || user.email}
            {isCurrentUser && <span className="text-salt-text-muted"> (You)</span>}
          </span>
        </div>
      </td>
      <td className="py-4 px-5 text-sm text-salt-text-sec">{user.email}</td>
      <td className="py-4 px-5">
        <RoleBadge role={user.role} />
      </td>
      <td className="py-4 px-5">
        <UserStatusDot isActive={user.isActive} />
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
        <UserActions
          user={user}
          isCurrentUser={isCurrentUser}
          onEdit={onEdit}
          onResetPassword={onResetPassword}
          // The row itself hovers to cream, so the trigger lifts the other way.
          hoverClass="hover:bg-white"
        />
      </td>
    </tr>
  )
}
