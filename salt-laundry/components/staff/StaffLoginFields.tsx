'use client'

import Link from 'next/link'
import { useFormContext } from 'react-hook-form'
import type { StaffLoginValues } from '@/lib/validations/staffLogin.schema'
import { FieldError } from '@/components/ui/FieldError'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { INPUT_CLASSES } from '@/lib/constants/formStyles'

export function StaffLoginFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<StaffLoginValues>()

  return (
    <>
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

      <div>
        <label htmlFor="password" className="block text-sm text-salt-text mb-1.5">
          Password
        </label>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          className={INPUT_CLASSES}
          {...register('password')}
        />
        <FieldError message={errors.password?.message} />
        <Link
          href="/staff/forgot-password"
          className="inline-block text-sm text-salt-text-sec underline mt-2"
        >
          Forgot password?
        </Link>
      </div>
    </>
  )
}
