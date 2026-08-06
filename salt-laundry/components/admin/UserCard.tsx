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

export function UserCard({
  user,
  isCurrentUser,
  onEdit,
  onResetPassword,
  onToggleAvailability,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-full bg-salt-green-light text-salt-green text-xs font-medium flex items-center justify-center">
            {getInitials(user.name, user.email)}
          </div>
          <div className="min-w-0">
            <div className="text-salt-text truncate">
              {user.name || user.email}
              {isCurrentUser && <span className="text-salt-text-muted"> (You)</span>}
            </div>
            <div className="text-sm text-salt-text-sec truncate">{user.email}</div>
          </div>
        </div>
        <RoleBadge role={user.role} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-salt-border">
        <div className="flex items-center gap-3">
          <UserStatusDot isActive={user.isActive} />
          {user.role === 'HOUSEKEEPER' && (
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
          )}
        </div>
        <UserActions
          user={user}
          isCurrentUser={isCurrentUser}
          onEdit={onEdit}
          onResetPassword={onResetPassword}
        />
      </div>
    </div>
  )
}
