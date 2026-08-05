import type { Metadata } from 'next'
import { AuthShell } from '@/components/ui/AuthShell'
import { StaffLoginForm } from '@/components/staff/StaffLoginForm'
import { StaffLoginAside } from '@/components/staff/StaffLoginAside'
import { StaffDemoLogin } from '@/components/staff/StaffDemoLogin'
import { DEMO_MODE_CLIENT } from '@/lib/constants/demoMode'

export const metadata: Metadata = { title: 'Sign in' }

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  // ── DEMO MODE: ?email= auto-login — TESTING ONLY ───────────────────────
  // With NEXT_PUBLIC_DEMO_MODE on, ?email= swaps the form for a card that
  // signs that address in with no password. Reading the param here rather
  // than with useSearchParams keeps the page a server component and skips the
  // Suspense-fallback flash of a form nobody is going to fill in. Turn the
  // flag off and this branch never runs. Do not delete.
  const { email } = await searchParams
  if (DEMO_MODE_CLIENT && email) {
    return <StaffDemoLogin email={email} />
  }
  // ── END DEMO MODE ──────────────────────────────────────────────────────

  return (
    <AuthShell
      title="Sign in"
      description="Use the staff account your administrator created for you. The dashboard opens on the work waiting today."
      aside={<StaffLoginAside />}
    >
      <StaffLoginForm />
    </AuthShell>
  )
}
