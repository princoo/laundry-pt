import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'
import { StaffNav } from '@/components/staff/StaffNav'

export default async function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const userName = session?.user?.name || session?.user?.email || undefined
  const role = (session?.user as any)?.role

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-salt-cream">
        <StaffNav userName={userName} role={role} />
        {children}
      </div>
    </SessionProvider>
  )
}
