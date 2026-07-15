import type { QueueStats } from '@/lib/hooks/useStaffDashboard'

interface Props {
  stats: QueueStats | null
}

const METRICS: { key: keyof QueueStats; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'collected', label: 'Collected' },
  { key: 'inProgress', label: 'In progress' },
  { key: 'ready', label: 'Ready' },
]

export function StatBar({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {METRICS.map(({ key, label }) => (
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
    </div>
  )
}
