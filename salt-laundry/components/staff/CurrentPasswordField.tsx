'use client'

import { useFormContext } from 'react-hook-form'
import { FieldError } from '@/components/ui/FieldError'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { INPUT_CLASSES } from '@/lib/constants/formStyles'

interface Props {
  label?: string
}

export function CurrentPasswordField({ label = 'Current password' }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<{ currentPassword: string }>()

  return (
    <div>
      <label htmlFor="currentPassword" className="block text-sm text-salt-text mb-1.5">
        {label}
      </label>
      <PasswordInput
        id="currentPassword"
        placeholder="••••••••"
        autoComplete="current-password"
        className={INPUT_CLASSES}
        {...register('currentPassword')}
      />
      <FieldError message={errors.currentPassword?.message} />
    </div>
  )
}
