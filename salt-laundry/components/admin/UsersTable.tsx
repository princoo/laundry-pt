import { UserRow } from '@/components/admin/UserRow'
import { UserCard } from '@/components/admin/UserCard'
import type { AdminUser } from '@/lib/hooks/useAdminUsers'

interface Props {
  users: AdminUser[]
  currentUserId: string
  onEdit: (user: AdminUser) => void
  onResetPassword: (user: AdminUser) => void
  onToggleAvailability: (id: string, nextIsAvailable: boolean) => void
}

const HEADERS = ['Name', 'Email', 'Role', 'Status', 'On shift', 'Actions']

export function UsersTable({
  users,
  currentUserId,
  onEdit,
  onResetPassword,
  onToggleAvailability,
}: Props) {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-10 text-center text-sm text-salt-text-sec">
        No staff accounts yet.
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-salt-cream text-salt-text-muted text-xs uppercase">
              {HEADERS.map((h) => (
                <th key={h} className="py-3 px-5 text-left font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                isCurrentUser={user.id === currentUserId}
                onEdit={onEdit}
                onResetPassword={onResetPassword}
                onToggleAvailability={onToggleAvailability}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isCurrentUser={user.id === currentUserId}
            onEdit={onEdit}
            onResetPassword={onResetPassword}
            onToggleAvailability={onToggleAvailability}
          />
        ))}
      </div>
    </>
  )
}
