import { KeyRound, Pencil } from 'lucide-react'
import { ActionMenu, type ActionMenuItem } from '@/components/ui/ActionMenu'
import type { AdminUser } from '@/lib/hooks/useAdminUsers'

interface Props {
  user: AdminUser
  isCurrentUser: boolean
  onEdit: (user: AdminUser) => void
  onResetPassword: (user: AdminUser) => void
  hoverClass?: string
}

// Shared by the desktop table row and the mobile card. Admins cannot reset
// their own password here — the profile page handles that.
export function UserActions({
  user,
  isCurrentUser,
  onEdit,
  onResetPassword,
  hoverClass,
}: Props) {
  const items: ActionMenuItem[] = [
    { label: 'Edit user', icon: Pencil, onSelect: () => onEdit(user) },
  ]

  if (!isCurrentUser) {
    items.push({
      label: 'Reset password',
      icon: KeyRound,
      onSelect: () => onResetPassword(user),
      toneClass: 'text-amber-600',
    })
  }

  return (
    <ActionMenu
      label={`Actions for ${user.name || user.email}`}
      items={items}
      hoverClass={hoverClass}
    />
  )
}
