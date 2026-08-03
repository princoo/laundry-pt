'use client'

import { StatusFilter } from '@/components/staff/StatusFilter'
import { SortToggle } from '@/components/staff/SortToggle'
import { QueueMeta } from '@/components/staff/QueueMeta'
import { MY_TASK_STATUS_FILTERS } from '@/lib/constants/statuses'
import type { SortOrder } from '@/lib/constants/queue'

interface Props {
  status: string
  onStatusChange: (status: string) => void
  sort: SortOrder
  onSortChange: (sort: SortOrder) => void
  total: number
  deliveredToday: number
  lastUpdated: Date | null
  onRefresh: () => void | Promise<void>
}

export function MyTasksFilterBar({
  status, onStatusChange, sort, onSortChange, total, deliveredToday, lastUpdated, onRefresh,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium text-salt-text">My tasks · {total}</span>
        <QueueMeta
          deliveredToday={deliveredToday} lastUpdated={lastUpdated} onRefresh={onRefresh}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusFilter active={status} onChange={onStatusChange} options={MY_TASK_STATUS_FILTERS} />
        <SortToggle sort={sort} onChange={onSortChange} />
      </div>
    </div>
  )
}
