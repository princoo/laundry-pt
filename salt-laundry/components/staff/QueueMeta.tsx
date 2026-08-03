'use client'

import { useEffect, useState } from 'react'
import { RefreshButton } from '@/components/ui/RefreshButton'
import { secondsAgoLabel } from '@/lib/utils/formatting'

interface Props {
  deliveredToday: number
  lastUpdated: Date | null
  onRefresh: () => void | Promise<void>
}

export function QueueMeta({ deliveredToday, lastUpdated, onRefresh }: Props) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-3 text-xs text-salt-text-muted">
      <span>Delivered today: {deliveredToday}</span>
      {lastUpdated && <span>{secondsAgoLabel(lastUpdated, now)}</span>}
      <RefreshButton onRefresh={onRefresh} label="Refresh queue" />
    </div>
  )
}
