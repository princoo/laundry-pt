import { UserAvatar } from '@/components/admin/UserAvatar'
import { UserContact } from '@/components/admin/UserContact'
import { UserFlagToggle } from '@/components/admin/UserFlagToggle'
import { UserStatusDot } from '@/components/admin/UserStatusDot'
import { RoleBadge } from '@/components/ui/RoleBadge'
import type { StaffUser } from '@/lib/types/staffUser'

interface Props {
  user: StaffUser
  isCurrentUser: boolean
  onToggleAvailability: (id: string, nextIsAvailable: boolean) => void
  onToggleHousekeeper: (id: string, nextIsHousekeeper: boolean) => void
}

export function UserCard({
  user, isCurrentUser, onToggleAvailability, onToggleHousekeeper,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar name={user.name} email={user.email} size="md" />
          <div className="min-w-0">
            <div className="text-salt-text truncate">
              {user.name || user.email}
              {isCurrentUser && <span className="text-salt-text-muted"> (You)</span>}
            </div>
            <UserContact email={user.email} phoneNumber={user.phoneNumber} />
            <div className="text-xs text-salt-text-muted truncate">
              {[user.departmentName, user.staffId && `Staff no. ${user.staffId}`]
                .filter(Boolean)
                .join(' · ')}
            </div>
          </div>
        </div>
        <RoleBadge roleNames={user.roleNames} shape="pill" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-salt-border">
        <UserStatusDot isActive={user.isActive} />
        <UserFlagToggle
          checked={user.isHousekeeper}
          onChange={() => onToggleHousekeeper(user.id, !user.isHousekeeper)}
          onLabel="Housekeeper"
          offLabel="Not a housekeeper"
        />
        {user.isHousekeeper && (
          <UserFlagToggle
            checked={user.isAvailable}
            onChange={() => onToggleAvailability(user.id, !user.isAvailable)}
            onLabel="On shift"
            offLabel="Off shift"
            offColorClass="bg-amber-400"
          />
        )}
      </div>
    </div>
  )
}
