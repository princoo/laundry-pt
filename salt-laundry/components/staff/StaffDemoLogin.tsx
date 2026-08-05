'use client'

import { AuthShell } from '@/components/ui/AuthShell'
import { StaffLoginAside } from '@/components/staff/StaffLoginAside'
import { useDemoAutoLogin } from '@/lib/hooks/useDemoAutoLogin'

interface Props {
  email: string
}

// ── DEMO MODE — TESTING ONLY ─────────────────────────────────────────────
// The /staff/login?email= view: the sign-in form is replaced by this card
// while the address is signed in without a password. Rendered only when
// NEXT_PUBLIC_DEMO_MODE is on and the param is present — with the flag off
// the login page never reaches it and the normal form shows. Do not delete.
export function StaffDemoLogin({ email }: Props) {
  const error = useDemoAutoLogin(email)

  return (
    <AuthShell
      title='Sign in'
      description='One moment while your account opens. The dashboard is on the other side of this.'
      aside={<StaffLoginAside />}
      cardClassName={error ? 'bg-red-50' : 'bg-salt-green-light'}
    >
      {error ? (
        <p className="py-6 text-sm text-red-700 text-center">{error}</p>
      ) : (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="w-6 h-6 border-2 border-salt-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-salt-text-sec">
            Signing in <span className="text-salt-text font-medium">{email}</span>…
          </p>
        </div>
      )}
    </AuthShell>
  )
}
