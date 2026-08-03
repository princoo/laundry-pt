'use client'

import { useFormContext } from 'react-hook-form'
import { FieldError } from '@/components/ui/FieldError'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { PasswordStrength } from '@/components/ui/PasswordStrength'
import { INPUT_CLASSES } from '@/lib/constants/formStyles'

interface NewPasswordValues {
  newPassword: string
  confirmPassword: string
}

interface Props {
  showStrength?: boolean
}

// Shared by the forced change-password page, the reset-password page and the
// profile page — every form that asks for a new password twice.
export function NewPasswordFields({ showStrength = false }: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<NewPasswordValues>()

  return (
    <>
      <div>
        <label htmlFor="newPassword" className="block text-sm text-salt-text mb-1.5">
          New password
        </label>
        <PasswordInput
          id="newPassword"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          className={INPUT_CLASSES}
          {...register('newPassword')}
        />
        {showStrength && <PasswordStrength password={watch('newPassword') ?? ''} />}
        <FieldError message={errors.newPassword?.message} />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm text-salt-text mb-1.5">
          Confirm new password
        </label>
        <PasswordInput
          id="confirmPassword"
          placeholder="••••••••"
          autoComplete="new-password"
          className={INPUT_CLASSES}
          {...register('confirmPassword')}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>
    </>
  )
}
