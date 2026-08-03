import type { AdminUser } from '@/lib/hooks/useAdminUsers'

export function RoleBadge({ role }: { role: AdminUser['role'] }) {
  if (role === 'ADMIN') {
    return (
      <span className="bg-salt-navy text-white text-xs px-2.5 py-1 rounded-full">Admin</span>
    )
  }
  if (role === 'SUPERVISOR') {
    return (
      <span className="bg-salt-green text-white text-xs px-2.5 py-1 rounded-full">Supervisor</span>
    )
  }
  return (
    <span className="bg-salt-cream text-salt-text-sec text-xs px-2.5 py-1 rounded-full">Housekeeper</span>
  )
}
