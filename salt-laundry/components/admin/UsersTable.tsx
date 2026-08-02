import { UserRow } from '@/components/admin/UserRow'
import type { AdminUser } from '@/lib/hooks/useAdminUsers'

interface Props {
  users: AdminUser[]
  onEdit: (user: AdminUser) => void
  onToggleAvailability: (id: string, nextIsAvailable: boolean) => void
}

const HEADERS = ['Name', 'Email', 'Role', 'Status', 'On shift', 'Actions']

export function UsersTable({ users, onEdit, onToggleAvailability }: Props) {
  return (
    <table className="w-full bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm overflow-hidden">
      <thead>
        <tr className="bg-salt-cream text-salt-text-muted text-xs uppercase">
          {HEADERS.map((h) => (
            <th key={h} className="py-3 px-5 text-left font-medium">
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
            onEdit={onEdit}
            onToggleAvailability={onToggleAvailability}
          />
        ))}
      </tbody>
    </table>
  )
}
