'use client'

import { useFormContext } from 'react-hook-form'
import type { GuestDetailsValues } from '@/lib/validations/guestRequest.schema'
import { FieldError } from '@/components/ui/FieldError'
import { ReadOnlyRoomField } from '@/components/guest/ReadOnlyRoomField'
import type { LockedRoom } from '@/lib/types/guestOrder'

const inputClasses =
  'w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-salt-navy bg-white'

interface Props {
  // Set when the room is already decided (edit or QR scan): it's shown, not asked
  // for. The value still reaches the payload through the form's default values.
  lockedRoom?: LockedRoom
}

export function GuestDetailsForm({ lockedRoom }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<GuestDetailsValues>()

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5">
      <p className="text-[11px] uppercase tracking-wide text-salt-text-muted font-medium mb-3">
        Your details
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        {lockedRoom ? (
          <ReadOnlyRoomField room={lockedRoom} />
        ) : (
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
        )}
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
    </div>
  )
}
