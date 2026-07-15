'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { trackRequestSchema, type TrackRequestValues } from '@/lib/validations/trackRequest.schema'
import { FieldError } from '@/components/ui/FieldError'

interface Props {
  defaultValues?: Partial<TrackRequestValues>
  isSubmitting: boolean
  onSubmit: (values: TrackRequestValues) => void
}

const inputClasses =
  'w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-salt-navy bg-white'

export function TrackForm({ defaultValues, isSubmitting, onSubmit }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<TrackRequestValues>({
    resolver: zodResolver(trackRequestSchema),
    defaultValues: {
      roomNumber: defaultValues?.roomNumber ?? '',
      reference: defaultValues?.reference ?? '',
    },
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5 flex flex-col md:flex-row gap-4 md:items-start"
      noValidate
    >
      <div className="flex-1">
        <label htmlFor="roomNumber" className="block text-sm text-salt-text mb-1.5">Room</label>
        <input id="roomNumber" placeholder="214" className={inputClasses} {...register('roomNumber')} />
        <FieldError message={errors.roomNumber?.message} />
      </div>
      <div className="flex-1">
        <label htmlFor="reference" className="block text-sm text-salt-text mb-1.5">Reference</label>
        <input
          id="reference"
          placeholder="LDY-2026-0142"
          className={inputClasses}
          {...register('reference')}
        />
        <FieldError message={errors.reference?.message} />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2 md:mt-6"
      >
        <Search className="w-4 h-4" />
        {isSubmitting ? 'Tracking…' : 'Track'}
      </button>
    </form>
  )
}
