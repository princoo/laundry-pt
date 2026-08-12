'use client'

import Link from 'next/link'
import { useSoaSignIn } from '@/lib/hooks/useSoaSignIn'
import { FormAlert } from '@/components/ui/FormAlert'
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from '@/lib/constants/formStyles'
import { SIGNED_IN_HOME } from '@/lib/constants/soa'

// The whole reason this page exists is that a sign-in can fail halfway
// across two systems. Both ways out are offered: retry the token in hand, or
// go back to SOA for a fresh one.
export function SoaSignInCard() {
  const { error, retry } = useSoaSignIn()

  if (!error) {
    return (
      <div className="flex flex-col gap-2" aria-live="polite">
        <p className="text-sm font-medium text-salt-text">Signing you in…</p>
        <p className="text-sm text-salt-text-sec leading-relaxed">
          Keep this page open. The dashboard opens on its own.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3" aria-live="polite">
      <FormAlert message={error} />

      <button type="button" onClick={retry} className={PRIMARY_BUTTON_CLASSES}>
        Try again
      </button>
      <Link href={SIGNED_IN_HOME} className={`${SECONDARY_BUTTON_CLASSES} text-center block`}>
        Sign in again
      </Link>
    </div>
  )
}
