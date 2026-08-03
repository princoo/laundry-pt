'use client'

import { useState } from 'react'
import { TrackResultItem } from '@/components/track/TrackResultItem'
import { TrackResultModal } from '@/components/track/TrackResultModal'
import type { TrackedRequest } from '@/lib/types/request'

interface Props {
  requests: TrackedRequest[]
}

export function TrackResultsList({ requests }: Props) {
  const [selected, setSelected] = useState<TrackedRequest | null>(null)

  return (
    <div className="flex flex-col gap-3 mt-4">
      {requests.map((r) => (
        <TrackResultItem key={r.id} request={r} onSelect={setSelected} />
      ))}
      {selected && <TrackResultModal request={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
