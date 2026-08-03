'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  adminResetPasswordSchema,
  type AdminResetPasswordValues,
} from '@/lib/validations/passwordReset.schema'
import { Modal } from '@/components/ui/Modal'
import { ModalActions } from '@/components/ui/ModalActions'
import { FieldError } from '@/components/ui/FieldError'
import { FormAlert } from '@/components/ui/FormAlert'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { INPUT_CLASSES } from '@/lib/constants/formStyles'
import type { AdminUser } from '@/lib/hooks/useAdminUsers'

interface Props {
  user: AdminUser
  onClose: () => void
  onReset: (name: string) => void
}

export function ResetPasswordModal({ user, onClose, onReset }: Props) {
  const displayName = user.name || user.email
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminResetPasswordValues>({ resolver: zodResolver(adminResetPasswordSchema) })

  async function onSubmit(values: AdminResetPasswordValues) {
    setSubmitError(null)
    const res = await fetch(`/api/admin/users/${user.id}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setSubmitError(data?.error ?? 'Could not reset the password. Try again.')
      return
    }
    onReset(displayName)
  }

  return (
    <Modal title={`Reset password for ${displayName}`} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
        <FormAlert message={submitError} />
        <p className="text-sm text-salt-text-sec">
          This will force them to set a new password on their next login.
        </p>

        <div>
          <label htmlFor="temporaryPassword" className="block text-sm text-salt-text mb-1.5">
            New temporary password
          </label>
          <PasswordInput
            id="temporaryPassword"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className={INPUT_CLASSES}
            {...register('temporaryPassword')}
          />
          <FieldError message={errors.temporaryPassword?.message} />
        </div>

        <ModalActions
          onCancel={onClose}
          isSubmitting={isSubmitting}
          submitLabel="Reset password"
          pendingLabel="Resetting…"
        />
      </form>
    </Modal>
  )
}
