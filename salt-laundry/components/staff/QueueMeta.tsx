'use client'

import { useEffect, useState } from 'react'
import { secondsAgoLabel } from '@/lib/utils/formatting'

interface Props {
  deliveredToday: number
  lastUpdated: Date | null
}

export function QueueMeta({ deliveredToday, lastUpdated }: Props) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center justify-end gap-3 mt-2 mb-4 text-[11px] text-salt-text-muted">
      <span>Delivered today: {deliveredToday}</span>
      {lastUpdated && <span>{secondsAgoLabel(lastUpdated, now)}</span>}
    </div>
  )
}
