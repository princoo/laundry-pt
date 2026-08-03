'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from '@/lib/validations/passwordReset.schema'
import { getPasswordChecks } from '@/lib/utils/password'
import { NewPasswordFields } from '@/components/staff/NewPasswordFields'
import { PasswordChecklist } from '@/components/ui/PasswordChecklist'
import { FormAlert } from '@/components/ui/FormAlert'
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from '@/lib/constants/formStyles'

interface Props {
  token: string
  onDone: () => void
}

export function ResetPasswordForm({ token, onDone }: Props) {
  const [error, setError] = useState<{ message: string; isExpired: boolean } | null>(null)
  const methods = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordFormSchema) })
  const { isSubmitting } = methods.formState
  const [next, confirm] = methods.watch(['newPassword', 'confirmPassword'])

  async function onSubmit(values: ResetPasswordFormValues) {
    setError(null)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: values.newPassword }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError({
        message: data?.error ?? 'Could not update your password. Try again.',
        isExpired: data?.code === 'EXPIRED_TOKEN',
      })
      return
    }
    onDone()
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormAlert message={error?.message} />
        {error?.isExpired && (
          <Link
            href="/staff/forgot-password"
            className={`${SECONDARY_BUTTON_CLASSES} block text-center`}
          >
            Request a new link
          </Link>
        )}
        <NewPasswordFields showStrength />
        <PasswordChecklist checks={getPasswordChecks(next ?? '', confirm ?? '')} />
        <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASSES}>
          {isSubmitting ? 'Saving…' : 'Set new password'}
        </button>
      </form>
    </FormProvider>
  )
}
