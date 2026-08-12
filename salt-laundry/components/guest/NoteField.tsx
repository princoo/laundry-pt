'use client'

import { useFormContext } from 'react-hook-form'
import type { GuestDetailsValues } from '@/lib/validations/guestRequest.schema'
import { INPUT_CLASSES } from '@/lib/constants/formStyles'

export function NoteField() {
  const { register } = useFormContext<GuestDetailsValues>()

  return (
    <div>
      <label htmlFor="note" className="block text-sm font-medium text-salt-text mb-1.5">
        Note (optional)
      </label>
      <textarea
        id="note"
        rows={3}
        placeholder="e.g. delicate, no starch"
        className={INPUT_CLASSES}
        {...register('note')}
      />
    </div>
  )
}
