'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { GuestNav } from '@/components/guest/GuestNav'
import { GuestFooter } from '@/components/guest/GuestFooter'
import { TrackSearchSection } from '@/components/track/TrackSearchSection'
import { TrackRequestDetail } from '@/components/track/TrackRequestDetail'
import { FormAlert } from '@/components/ui/FormAlert'
import type { TrackedRequest } from '@/lib/types/request'

export function TrackPageContent() {
  const searchParams = useSearchParams()
  const initialRoom = searchParams.get('room') ?? ''
  const initialReference = searchParams.get('reference') ?? ''
  // Set by the edit form on its way back here.
  const justEdited = searchParams.get('edited') === '1'
  const [selected, setSelected] = useState<TrackedRequest | null>(null)

  return (
    <div className="min-h-screen bg-salt-cream flex flex-col">
      <GuestNav active="track" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="mt-8 mb-6">
          <h1 className="text-[28px] sm:text-[32px] font-black text-salt-text">Track your laundry</h1>
          <p className="text-sm text-salt-text-sec mt-1">
            Enter your room number to see your active order.
          </p>
        </div>

        {justEdited && (
          <div className="mb-4">
            <FormAlert message="Request updated." variant="success" />
          </div>
        )}

        <TrackSearchSection
          initialRoom={initialRoom}
          initialReference={initialReference}
          onResult={setSelected}
        />

        {selected && (
          <div className="mt-4 pb-10">
            <TrackRequestDetail request={selected} />
          </div>
        )}
      </div>

      <GuestFooter />
    </div>
  )
}
