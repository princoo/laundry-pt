'use client'

import { AuthNotice } from '@/components/ui/AuthNotice'
import { SECONDARY_BUTTON_CLASSES } from '@/lib/constants/formStyles'

interface Props {
  email: string
  onRetry: () => void
}

// Same confirmation whether or not the address exists — no account enumeration.
export function ForgotPasswordSent({ email, onRetry }: Props) {
  return (
    <AuthNotice
      title="Check your email"
      body={
        <>
          If <span className="text-salt-text break-words">{email}</span> is registered, a
          reset link is on its way. It works for 15 minutes.
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <p className="text-xs text-salt-text-muted">
          Nothing yet? Look in your spam folder, or check the address for a typo.
        </p>
        <button type="button" onClick={onRetry} className={SECONDARY_BUTTON_CLASSES}>
          Send another link
        </button>
      </div>
    </AuthNotice>
  )
}
