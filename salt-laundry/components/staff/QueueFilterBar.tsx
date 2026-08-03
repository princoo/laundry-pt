'use client'

import { StatusFilter } from '@/components/staff/StatusFilter'
import { AssigneeFilter } from '@/components/staff/AssigneeFilter'
import { QueueMeta } from '@/components/staff/QueueMeta'

interface Props {
  status: string
  onStatusChange: (status: string) => void
  assignedTo: string | undefined
  onAssignedToChange: (housekeeperId: string | undefined) => void
  deliveredToday: number
  lastUpdated: Date | null
  onRefresh: () => void | Promise<void>
}

export function QueueFilterBar({
  status, onStatusChange, assignedTo, onAssignedToChange, deliveredToday, lastUpdated, onRefresh,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusFilter active={status} onChange={onStatusChange} />
        <QueueMeta
          deliveredToday={deliveredToday} lastUpdated={lastUpdated} onRefresh={onRefresh}
        />
      </div>
      <div className="w-full sm:w-60">
        <AssigneeFilter value={assignedTo} onChange={onAssignedToChange} />
      </div>
    </div>
  )
}
