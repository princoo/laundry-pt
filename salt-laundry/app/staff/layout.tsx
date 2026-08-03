import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { StaffNav } from '@/components/staff/StaffNav'
import { StaffFooter } from '@/components/staff/StaffFooter'
import { NotificationToasts } from '@/components/staff/NotificationToasts'

// Base for all /staff/* pages — individual pages override the title only.
// No Open Graph: staff pages require login and should never be shared.
export const metadata: Metadata = {
  title: {
    template: '%s | SALT Staff',
    // Resolved through the root template, so this renders as
    // "Staff Dashboard | SALT of Akagera" — do not repeat the suffix here.
    default: 'Staff Dashboard',
  },
  description: 'SALT of Akagera internal laundry management dashboard.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default async function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (!session) {
    return <div className="min-h-screen bg-salt-cream print:bg-white">{children}</div>
  }

  // proxy.ts keeps anyone still carrying a temporary password on the
  // change-password page, so no nav — there is nowhere else to go yet.
  if ((session.user as any)?.mustChangePassword) {
    return <div className="min-h-screen bg-salt-cream">{children}</div>
  }

  const userName = session.user?.name || session.user?.email || undefined
  const role = (session.user as any)?.role

  return (
    <div className="min-h-screen flex flex-col bg-salt-cream print:bg-white">
      <StaffNav userName={userName} role={role} />
      <NotificationToasts />
      <main className="flex-1">{children}</main>
      <StaffFooter />
    </div>
  )
}
