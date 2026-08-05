'use client'

import { useFormContext } from 'react-hook-form'
import type { GuestDetailsValues } from '@/lib/validations/guestRequest.schema'

const OPTIONS = [
  { isHanger: true, label: 'Shirt on hanger' },
  { isHanger: false, label: 'Folded' },
]

// Lives in the order summary rather than the details card: how the laundry
// comes back is part of the order, next to express and the note.
export function HandlingToggle() {
  const { watch, setValue } = useFormContext<GuestDetailsValues>()
  const isHanger = watch('isHanger')

  return (
    <div>
      <p className="text-sm font-medium text-salt-text mb-1.5">Handling</p>
      <div className="flex gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => setValue('isHanger', option.isHanger)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
              isHanger === option.isHanger
                ? 'bg-salt-navy hover:bg-salt-navy-hover text-white'
                : 'bg-white text-salt-text-sec border border-[0.5px] border-salt-border'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
