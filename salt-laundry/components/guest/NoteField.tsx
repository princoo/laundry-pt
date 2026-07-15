'use client'

import { useFormContext } from 'react-hook-form'
import type { GuestDetailsValues } from '@/lib/validations/guestRequest.schema'

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
        className="w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-salt-navy bg-white"
        {...register('note')}
      />
    </div>
  )
}
