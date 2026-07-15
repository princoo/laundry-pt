'use client'

import { useFormContext } from 'react-hook-form'
import type { GuestDetailsValues } from '@/lib/validations/guestRequest.schema'
import { FieldError } from '@/components/ui/FieldError'

const inputClasses =
  'w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-salt-navy bg-white'

export function GuestDetailsForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<GuestDetailsValues>()
  const isHanger = watch('isHanger')

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5">
      <p className="text-[11px] uppercase tracking-wide text-salt-text-muted font-medium mb-3">
        Your details
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="roomNumber" className="block text-sm text-salt-text mb-1.5">
            Room number*
          </label>
          <input
            id="roomNumber"
            type="text"
            placeholder="e.g. 214"
            className={inputClasses}
            {...register('roomNumber')}
          />
          <FieldError message={errors.roomNumber?.message} />
        </div>
        <div className="flex-1">
          <label htmlFor="guestName" className="block text-sm text-salt-text mb-1.5">
            Name (optional)
          </label>
          <input
            id="guestName"
            type="text"
            placeholder="e.g. J. Okafor"
            className={inputClasses}
            {...register('guestName')}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => setValue('isHanger', true)}
          className={`py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
            isHanger
              ? 'bg-salt-navy hover:bg-salt-navy-hover text-white'
              : 'bg-white text-salt-text-sec border border-[0.5px] border-salt-border'
          }`}
        >
          Shirt on hanger
        </button>
        <button
          type="button"
          onClick={() => setValue('isHanger', false)}
          className={`py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
            !isHanger
              ? 'bg-salt-navy hover:bg-salt-navy-hover text-white'
              : 'bg-white text-salt-text-sec border border-[0.5px] border-salt-border'
          }`}
        >
          Folded
        </button>
      </div>
    </div>
  )
}
