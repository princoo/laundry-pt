'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { trackByRoomSchema, type TrackByRoomValues } from '@/lib/validations/trackRequest.schema'
import { FieldError } from '@/components/ui/FieldError'

interface Props {
  defaultRoom?: string
  isSubmitting: boolean
  onSubmit: (values: TrackByRoomValues) => void
}

export function RoomLookupForm({ defaultRoom, isSubmitting, onSubmit }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<TrackByRoomValues>({
    resolver: zodResolver(trackByRoomSchema),
    defaultValues: { roomNumber: defaultRoom ?? '' },
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5 flex flex-col md:flex-row gap-4 md:items-start"
      noValidate
    >
      <div className="flex-1">
        <label htmlFor="roomNumber" className="block text-sm text-salt-text mb-1.5">Room</label>
        <input
          id="roomNumber"
          placeholder="214"
          className="w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-salt-navy bg-white"
          {...register('roomNumber')}
        />
        <FieldError message={errors.roomNumber?.message} />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2 md:mt-6"
      >
        <Search className="w-4 h-4" />
        {isSubmitting ? 'Searching…' : 'Find my order'}
      </button>
    </form>
  )
}
