'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { trackRequestSchema, type TrackRequestValues } from '@/lib/validations/trackRequest.schema'
import { FieldError } from '@/components/ui/FieldError'
import { RoomNumberInput } from '@/components/ui/RoomNumberInput'
import { INPUT_CLASSES } from '@/lib/constants/formStyles'

interface Props {
  defaultValues?: Partial<TrackRequestValues>
  // The room arrived pre-filled from the URL (a scanned link): show it, but
  // don't let it be changed.
  lockRoom?: boolean
  isSubmitting: boolean
  onSubmit: (values: TrackRequestValues) => void
}

export function TrackForm({ defaultValues, lockRoom, isSubmitting, onSubmit }: Props) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<TrackRequestValues>({
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
        <Controller
          control={control}
          name="roomNumber"
          render={({ field, fieldState }) => (
            <RoomNumberInput
              id="roomNumber"
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={!!fieldState.error}
              hideDropdown
              disabled={lockRoom}
            />
          )}
        />
        <FieldError message={errors.roomNumber?.message} />
      </div>
      <div className="flex-1">
        <label htmlFor="reference" className="block text-sm text-salt-text mb-1.5">Reference</label>
        <input
          id="reference"
          placeholder="LDY-2026-0142"
          className={INPUT_CLASSES}
          {...register('reference')}
        />
        <FieldError message={errors.reference?.message} />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2 min-h-[44px] md:mt-6"
      >
        <Search className="w-4 h-4" />
        {isSubmitting ? 'Tracking…' : 'Track'}
      </button>
    </form>
  )
}
