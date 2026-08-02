import type { QueueStats, QueueRequest } from '@/lib/hooks/useStaffDashboard'
import { hasAlert } from '@/lib/utils/sla'

interface Metric {
  key: keyof QueueStats
  label: string
}

interface Props {
  stats: QueueStats | null
  metrics?: Metric[]
  requests?: QueueRequest[]
  alertActive?: boolean
  onAlertClick?: () => void
}

const DEFAULT_METRICS: Metric[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'collected', label: 'Collected' },
  { key: 'inProgress', label: 'In progress' },
  { key: 'ready', label: 'Ready' },
]

export function StatBar({ stats, metrics = DEFAULT_METRICS, requests, alertActive, onAlertClick }: Props) {
  const alertCount = requests ? requests.filter(hasAlert).length : null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {metrics.map(({ key, label }) => (
        <div
          key={key}
          className="bg-white rounded-xl border border-[0.5px] border-salt-border p-4 text-center"
        >
          <div className="text-2xl font-medium text-salt-navy">
            {stats ? stats[key] : '–'}
          </div>
          <div className="text-xs text-salt-text-muted mt-1">{label}</div>
        </div>
      ))}
      {alertCount !== null && (
        <button
          type="button"
          onClick={onAlertClick}
          className={`bg-white rounded-xl border border-[0.5px] p-4 text-center transition-colors ${alertActive ? 'border-red-400' : 'border-salt-border hover:border-salt-navy'}`}
        >
          <div className="text-2xl font-medium text-red-600">{alertCount}</div>
          <div className="text-xs text-salt-text-muted mt-1">Needs attention</div>
        </button>
      )}
    </div>
  )
}
