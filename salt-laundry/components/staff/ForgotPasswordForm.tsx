'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from '@/lib/validations/passwordReset.schema'
import { FieldError } from '@/components/ui/FieldError'
import { FormAlert } from '@/components/ui/FormAlert'
import { INPUT_CLASSES, PRIMARY_BUTTON_CLASSES } from '@/lib/constants/formStyles'

interface Props {
  defaultEmail?: string
  onSent: (email: string) => void
}

export function ForgotPasswordForm({ defaultEmail, onSent }: Props) {
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: defaultEmail ?? '' },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    setError(null)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Request failed')
      onSent(values.email)
    } catch {
      setError('Could not send the reset link. Check your connection and try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <FormAlert message={error} />
      <div>
        <label htmlFor="email" className="block text-sm text-salt-text mb-1.5">
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="your@salt.rw"
          autoComplete="email"
          autoFocus
          className={INPUT_CLASSES}
          {...register('email')}
        />
        <FieldError message={errors.email?.message} />
      </div>
      <p className="text-xs text-salt-text-muted">
        The link works for 15 minutes after it is sent.
      </p>
      <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASSES}>
        {isSubmitting ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  )
}
