'use client'

import Link from 'next/link'
import { useFormContext } from 'react-hook-form'
import type { StaffLoginValues } from '@/lib/validations/staffLogin.schema'
import { FieldError } from '@/components/ui/FieldError'
import { PasswordInput } from '@/components/ui/PasswordInput'

const inputClasses =
  'w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-salt-navy bg-white'

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
          className={inputClasses}
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
          className={inputClasses}
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
