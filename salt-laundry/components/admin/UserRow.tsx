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

export function UserRow({
  user, isCurrentUser, onToggleAvailability, onToggleHousekeeper,
}: Props) {
  return (
    <tr className="border-b border-[0.5px] border-salt-border last:border-0 hover:bg-salt-cream transition-colors">
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} email={user.email} />
          <div className="min-w-0">
            <div className="text-salt-text">
              {user.name || user.email}
              {isCurrentUser && <span className="text-salt-text-muted"> (You)</span>}
            </div>
            {user.staffId && (
              <div className="text-xs text-salt-text-muted">Staff no. {user.staffId}</div>
            )}
          </div>
        </div>
      </td>
      <td className="py-4 px-5">
        <UserContact email={user.email} phoneNumber={user.phoneNumber} />
      </td>
      <td className="py-4 px-5 text-sm text-salt-text-sec">{user.departmentName || '—'}</td>
      <td className="py-4 px-5">
        <RoleBadge roleNames={user.roleNames} shape="pill" />
      </td>
      <td className="py-4 px-5">
        <UserStatusDot isActive={user.isActive} />
      </td>
      <td className="py-4 px-5">
        <UserFlagToggle
          checked={user.isHousekeeper}
          onChange={() => onToggleHousekeeper(user.id, !user.isHousekeeper)}
          onLabel="Housekeeper"
          offLabel="Not a housekeeper"
        />
      </td>
      <td className="py-4 px-5">
        {user.isHousekeeper ? (
          <UserFlagToggle
            checked={user.isAvailable}
            onChange={() => onToggleAvailability(user.id, !user.isAvailable)}
            onLabel="On shift"
            offLabel="Off shift"
            offColorClass="bg-amber-400"
          />
        ) : (
          <span className="text-salt-text-muted text-sm">—</span>
        )}
      </td>
    </tr>
  )
}
