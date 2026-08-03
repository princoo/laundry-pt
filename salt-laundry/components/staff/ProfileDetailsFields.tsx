'use client'

import { useFormContext } from 'react-hook-form'
import type { ProfileDetailsValues } from '@/lib/validations/profile.schema'
import { FieldError } from '@/components/ui/FieldError'
import { INPUT_CLASSES } from '@/lib/constants/formStyles'

export function ProfileDetailsFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileDetailsValues>()

  return (
    <>
      <div>
        <label htmlFor="name" className="block text-sm text-salt-text mb-1.5">
          Full name
        </label>
        <input id="name" autoComplete="name" className={INPUT_CLASSES} {...register('name')} />
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-salt-text mb-1.5">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={INPUT_CLASSES}
          {...register('email')}
        />
        <FieldError message={errors.email?.message} />
      </div>
    </>
  )
}
