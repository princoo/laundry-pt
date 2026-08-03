'use client'

import { useState } from 'react'
import { AuthShell } from '@/components/ui/AuthShell'
import { StepList } from '@/components/ui/StepList'
import { PASSWORD_RECOVERY_STEPS } from '@/lib/constants/authFlow'
import { ResetPasswordForm } from '@/components/staff/ResetPasswordForm'
import { ResetPasswordDone } from '@/components/staff/ResetPasswordDone'

interface Props {
  token: string
}

// Owns the done state so the progress rail can complete alongside the card.
export function ResetPasswordScreen({ token }: Props) {
  const [isDone, setIsDone] = useState(false)

  return (
    <AuthShell
      title={isDone ? 'Password updated' : 'Choose a new password'}
      description={
        isDone
          ? 'Your new password is active on your account.'
          : 'Pick something you have not used on this account before. You will type it every time you sign in.'
      }
      aside={
        <StepList
          steps={PASSWORD_RECOVERY_STEPS}
          current={isDone ? PASSWORD_RECOVERY_STEPS.length + 1 : 3}
        />
      }
    >
      {isDone ? (
        <ResetPasswordDone />
      ) : (
        <ResetPasswordForm token={token} onDone={() => setIsDone(true)} />
      )}
    </AuthShell>
  )
}
