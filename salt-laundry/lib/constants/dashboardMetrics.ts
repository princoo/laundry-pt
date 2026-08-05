import type { QueueMetric } from '@/lib/types/staffDashboard'

// A housekeeper's bar counts only their own tasks; the API scopes the figures.
export const MY_METRICS: QueueMetric[] = [
  { key: 'pending', label: 'My pending' },
  { key: 'collected', label: 'My collected' },
  { key: 'inProgress', label: 'My in progress' },
  { key: 'ready', label: 'My ready' },
  { key: 'needsAttention', label: 'Needs attention', tone: 'alert' },
]

export const SUPERVISOR_METRICS: QueueMetric[] = [
  { key: 'pending', label: 'All pending' },
  { key: 'inProgress', label: 'All in progress' },
  { key: 'ready', label: 'All ready' },
  { key: 'unassigned', label: 'Unassigned' },
  { key: 'needsAttention', label: 'Needs attention', tone: 'alert' },
]
