'use client'

import { useFormContext, Controller } from 'react-hook-form'
import type { UserFormValues } from '@/lib/validations/user.schema'
import { FieldError } from '@/components/ui/FieldError'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Select } from '@/components/ui/Select'
import { ActiveToggle } from '@/components/ui/ActiveToggle'

interface Props {
  isNew: boolean
  disableActiveToggle: boolean
}

const inputClasses =
  'w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-salt-navy bg-white'

const ROLE_OPTIONS = [
  { value: 'HOUSEKEEPER', label: 'Housekeeper' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'ADMIN', label: 'Admin' },
]

export function UserFormFields({ isNew, disableActiveToggle }: Props) {
  const {
    register,
    control,
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
        <input type="email" autoComplete="off" className={inputClasses} {...register('email')} />
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <label className="block text-sm text-salt-text mb-1">Role*</label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => <Select value={field.value} onChange={field.onChange} options={ROLE_OPTIONS} />}
        />
        <FieldError message={errors.role?.message} />
      </div>
      {isNew && (
        <div>
          <label className="block text-sm text-salt-text mb-1">Password*</label>
          <PasswordInput autoComplete="new-password" className={inputClasses} {...register('password')} />
          <FieldError message={errors.password?.message} />
        </div>
      )}

      {!isNew && (
        <div className="flex items-center justify-between gap-3 border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5">
          <div>
            <div className="text-sm text-salt-text">Active account</div>
            <div className="text-xs text-salt-text-muted mt-0.5">
              {disableActiveToggle ? 'You cannot deactivate your own account.' : 'Inactive staff cannot sign in.'}
            </div>
          </div>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <ActiveToggle checked={field.value} onChange={() => field.onChange(!field.value)} disabled={disableActiveToggle} />
            )}
          />
        </div>
      )}
    </>
  )
}
