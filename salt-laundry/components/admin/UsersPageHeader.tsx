import type { AdminUser } from '@/lib/hooks/useAdminUsers'

interface Props {
  users: AdminUser[]
  showCount: boolean
  onAdd: () => void
}

export function UsersPageHeader({ users, showCount, onAdd }: Props) {
  return (
    <div className="flex items-start justify-between gap-3 mb-6">
      <div>
        <h1 className="text-[22px] font-black text-salt-text">Staff accounts</h1>
        {showCount && (
          <p className="text-sm text-salt-text-sec mt-1">
            {users.length} {users.length === 1 ? 'account' : 'accounts'} ·{' '}
            {users.filter((u) => u.isActive).length} active
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-4 py-2 text-sm shrink-0"
      >
        Add staff member
      </button>
    </div>
  )
}
