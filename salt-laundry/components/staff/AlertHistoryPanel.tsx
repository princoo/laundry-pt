import { AlertTriangle } from 'lucide-react'
import { ALERT_LABELS } from '@/lib/constants/alerts'
import { formatEventTimestamp } from '@/lib/utils/formatting'
import type { AlertEventRecord } from '@/lib/types/request'

interface Props {
  events: AlertEventRecord[]
}

export function AlertHistoryPanel({ events }: Props) {
  if (events.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-6">
      <div className="text-xs font-medium text-salt-text-sec mb-2">Alert history (supervisor only)</div>
      {events.map((event, i) => (
        <div key={i} className="flex items-center justify-between text-xs text-salt-text-muted py-1">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" /> {ALERT_LABELS[event.level]}
          </span>
          <span>{formatEventTimestamp(event.detectedAt)}</span>
        </div>
      ))}
    </div>
  )
}
