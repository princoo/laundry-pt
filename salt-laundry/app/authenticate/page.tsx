import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthShell } from '@/components/ui/AuthShell'
import { SoaSignInCard } from '@/components/staff/SoaSignInCard'

// The URL that lands here carries a sign-in token, so this page must never be
// indexed and must never send a referrer anywhere. The matching
// Referrer-Policy header is set in next.config.ts.
export const metadata: Metadata = {
  title: 'Signing in',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
}

export default function AuthenticatePage() {
  return (
    <AuthShell
      title="Signing you in"
      description="SALT accounts are managed in SOA. We are confirming yours and opening the laundry dashboard."
    >
      <Suspense fallback={null}>
        <SoaSignInCard />
      </Suspense>
    </AuthShell>
  )
}
