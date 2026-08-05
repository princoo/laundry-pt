import { MY_METRICS } from '@/lib/constants/dashboardMetrics'
import type { QueueStats, QueueMetric } from '@/lib/types/staffDashboard'

interface Props {
  stats: QueueStats | null
  metrics?: QueueMetric[]
}

export function StatBar({ stats, metrics = MY_METRICS }: Props) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3">
      {metrics.map(({ key, label, tone }) => (
        <div
          key={key}
          className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 text-center"
        >
          <div
            className={`text-2xl font-medium ${tone === 'alert' ? 'text-red-600' : 'text-salt-navy'}`}
          >
            {stats ? stats[key] : '–'}
          </div>
          <div className="text-xs text-salt-text-muted mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
