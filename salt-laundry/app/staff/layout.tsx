import { auth } from '@/lib/auth'
import { StaffNav } from '@/components/staff/StaffNav'
import { NotificationToasts } from '@/components/staff/NotificationToasts'

export default async function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (!session) {
    return <div className="min-h-screen bg-salt-cream print:bg-white">{children}</div>
  }

  const userName = session.user?.name || session.user?.email || undefined
  const role = (session.user as any)?.role

  return (
    <div className="min-h-screen bg-salt-cream print:bg-white">
      <StaffNav userName={userName} role={role} />
      <NotificationToasts />
      {children}
    </div>
  )
}
