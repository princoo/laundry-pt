'use client'

import { useFormContext } from 'react-hook-form'
import type { UserFormValues } from '@/lib/validations/user.schema'
import { FieldError } from '@/components/ui/FieldError'

interface Props {
  isNew: boolean
  disableActiveToggle: boolean
}

const inputClasses =
  'w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-salt-navy bg-white'

export function UserFormFields({ isNew, disableActiveToggle }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<UserFormValues>()

  return (
    <>
      <div>
        <label className="block text-sm text-salt-text mb-1">Full name</label>
        <input className={inputClasses} {...register('name')} />
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <label className="block text-sm text-salt-text mb-1">Email address*</label>
        <input type="email" className={inputClasses} {...register('email')} />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <label className="block text-sm text-salt-text mb-1">Role*</label>
        <select className={inputClasses} {...register('role')}>
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>
        <FieldError message={errors.role?.message} />
      </div>

      {isNew && (
        <div>
          <label className="block text-sm text-salt-text mb-1">Password*</label>
          <input type="password" className={inputClasses} {...register('password')} />
          <FieldError message={errors.password?.message} />
        </div>
      )}

      {!isNew && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            disabled={disableActiveToggle}
            className="w-4 h-4"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm text-salt-text">
            Active
          </label>
          {disableActiveToggle && (
            <span className="text-xs text-salt-text-muted">
              You cannot deactivate your own account.
            </span>
          )}
        </div>
      )}
    </>
  )
}
