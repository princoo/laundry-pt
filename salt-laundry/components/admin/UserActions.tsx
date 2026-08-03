import { Pencil } from 'lucide-react'
import type { AdminUser } from '@/lib/hooks/useAdminUsers'

interface Props {
  user: AdminUser
  isCurrentUser: boolean
  onEdit: (user: AdminUser) => void
  onResetPassword: (user: AdminUser) => void
  editHoverClass?: string
}

// Shared by the desktop table row and the mobile card. Admins cannot reset
// their own password here — the profile page handles that.
export function UserActions({
  user,
  isCurrentUser,
  onEdit,
  onResetPassword,
  editHoverClass = 'hover:bg-white',
}: Props) {
  return (
    <div className="flex items-center gap-2">
      {!isCurrentUser && (
        <button
          type="button"
          onClick={() => onResetPassword(user)}
          className="text-amber-600 text-sm hover:underline whitespace-nowrap"
        >
          Reset password
        </button>
      )}
      <button
        type="button"
        onClick={() => onEdit(user)}
        aria-label={`Edit ${user.name || user.email}`}
        className={`w-8 h-8 inline-flex items-center justify-center rounded-md text-salt-text-sec hover:text-salt-navy ${editHoverClass} transition-colors`}
      >
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  )
}
