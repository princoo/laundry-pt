'use client'

import { useEffect, useState } from 'react'
import { TrackForm } from '@/components/track/TrackForm'
import { RoomLookupForm } from '@/components/track/RoomLookupForm'
import { TrackResultsList } from '@/components/track/TrackResultsList'
import { SearchStatus } from '@/components/track/SearchStatus'
import { useRoomRequests } from '@/lib/hooks/useRoomRequests'
import { useTrackRequest } from '@/lib/hooks/useTrackRequest'
import type { TrackedRequest } from '@/lib/types/request'

interface Props {
  initialRoom: string
  initialReference: string
  onResult: (request: TrackedRequest | null) => void
}

const switchLinkClasses = 'text-sm text-salt-navy mt-1 py-2 hover:underline'

export function TrackSearchSection({ initialRoom, initialReference, onResult }: Props) {
  const [manual, setManual] = useState(Boolean(initialReference))
  const room = useRoomRequests()
  const exact = useTrackRequest()

  useEffect(() => {
    if (initialRoom && initialReference) exact.search(initialRoom, initialReference)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    onResult(exact.request)
  }, [exact.request, onResult])

  useEffect(() => {
    if (!room.requests) return
    onResult(room.requests.length === 1 ? room.requests[0] : null)
  }, [room.requests, onResult])

  const switchTo = (toManual: boolean) => {
    setManual(toManual)
    onResult(null)
  }

  if (manual) {
    return (
      <>
        <TrackForm
          defaultValues={{ roomNumber: initialRoom, reference: initialReference }}
          isSubmitting={exact.isLoading}
          onSubmit={(values) => exact.search(values.roomNumber, values.reference)}
        />
        <button type="button" onClick={() => switchTo(false)} className={switchLinkClasses}>
          Search by room number instead
        </button>
        <SearchStatus isLoading={exact.isLoading} error={exact.error} onRetry={exact.retry} notFound={exact.notFound} />
      </>
    )
  }

  return (
    <>
      <RoomLookupForm defaultRoom={initialRoom} isSubmitting={room.isLoading} onSubmit={(v) => room.search(v.roomNumber)} />
      <button type="button" onClick={() => switchTo(true)} className={switchLinkClasses}>
        Already delivered? Search by reference
      </button>
      <SearchStatus
        isLoading={room.isLoading}
        error={room.error}
        onRetry={room.retry}
        notFound={room.requests?.length === 0}
        notFoundMessage="No active order for that room. Already delivered? Search by reference above."
      />
      {!room.isLoading && room.requests && room.requests.length > 1 && (
        <TrackResultsList requests={room.requests} />
      )}
    </>
  )
}
