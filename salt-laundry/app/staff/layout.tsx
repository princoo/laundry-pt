import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { StaffNav } from '@/components/staff/StaffNav'
import { StaffFooter } from '@/components/staff/StaffFooter'
import { NotificationToasts } from '@/components/staff/NotificationToasts'
import { AccessDenied } from '@/components/ui/AccessDenied'
import { hasPermission } from '@/lib/utils/permissions'

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

  const userName = session.user?.name || session.user?.email || undefined
  const user = session.user as { permissions?: string[]; roleNames?: string[] }

  // LAUNDRY_REQUEST_VIEW is the baseline for the whole dashboard — SOA has no
  // general "may use the laundry" permission, so this one doubles as it.
  if (!hasPermission(user?.permissions, 'LAUNDRY_REQUEST_VIEW')) {
    return (
      <div className="min-h-screen bg-salt-cream">
        <AccessDenied backHref="/" backLabel="Back to the guest form" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-salt-cream print:bg-white">
      <StaffNav userName={userName} roleNames={user?.roleNames ?? []} />
      <NotificationToasts />
      <main className="flex-1">{children}</main>
      <StaffFooter />
    </div>
  )
}
