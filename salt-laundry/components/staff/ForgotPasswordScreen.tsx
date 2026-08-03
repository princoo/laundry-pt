'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthShell } from '@/components/ui/AuthShell'
import { StepList } from '@/components/ui/StepList'
import { PASSWORD_RECOVERY_STEPS } from '@/lib/constants/authFlow'
import { ForgotPasswordForm } from '@/components/staff/ForgotPasswordForm'
import { ForgotPasswordSent } from '@/components/staff/ForgotPasswordSent'

// Owns the sent state so the progress rail in the left column moves with it,
// and keeps the address so "send another link" comes back prefilled.
export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)

  return (
    <AuthShell
      title={isSent ? 'Reset link sent' : 'Forgot your password'}
      description={
        isSent
          ? 'Open the link from your inbox to finish choosing a new password.'
          : 'Enter the email address you sign in with. We will send a link that lets you choose a new password.'
      }
      aside={
        <div className="flex flex-col gap-6">
          <StepList steps={PASSWORD_RECOVERY_STEPS} current={isSent ? 2 : 1} />
          <Link
            href="/staff/login"
            className="text-sm text-salt-navy hover:text-salt-navy-hover underline underline-offset-2 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      }
    >
      {isSent ? (
        <ForgotPasswordSent email={email} onRetry={() => setIsSent(false)} />
      ) : (
        <ForgotPasswordForm
          defaultEmail={email}
          onSent={(value) => {
            setEmail(value)
            setIsSent(true)
          }}
        />
      )}
    </AuthShell>
  )
}
