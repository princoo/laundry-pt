'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { GuestNav } from '@/components/guest/GuestNav'
import { GuestFooter } from '@/components/guest/GuestFooter'
import { TrackSearchSection } from '@/components/track/TrackSearchSection'
import { RequestHeaderCard } from '@/components/ui/RequestHeaderCard'
import { ItemBreakdownCard } from '@/components/ui/ItemBreakdownCard'
import { StatusStepper } from '@/components/ui/StatusStepper'
import type { TrackedRequest } from '@/lib/types/request'

export function TrackPageContent() {
  const searchParams = useSearchParams()
  const initialRoom = searchParams.get('room') ?? ''
  const initialReference = searchParams.get('reference') ?? ''
  const [selected, setSelected] = useState<TrackedRequest | null>(null)

  return (
    <div className="min-h-screen bg-salt-cream flex flex-col">
      <GuestNav active="track" />

      <div className="max-w-3xl mx-auto px-4 flex-1 w-full">
        <div className="mt-8 mb-6">
          <h1 className="text-[28px] font-black text-salt-text">Track your laundry</h1>
          <p className="text-sm text-salt-text-sec mt-1">
            Enter your room number to see your active order.
          </p>
        </div>

        <TrackSearchSection
          initialRoom={initialRoom}
          initialReference={initialReference}
          onResult={setSelected}
        />

        {selected && (
          <div className="mt-4 pb-10">
            <RequestHeaderCard request={selected} reference={selected.reference} />
            <ItemBreakdownCard request={selected} />
            <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-6 mt-4">
              <div className="text-[11px] uppercase text-salt-text-muted mb-4">Status</div>
              <StatusStepper
                status={selected.status}
                collectedAt={selected.collectedAt}
                completedAt={selected.completedAt}
                returnedAt={selected.returnedAt}
              />
            </div>
          </div>
        )}
      </div>

      <GuestFooter />
    </div>
  )
}
