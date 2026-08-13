'use client'

import { StatusFilter } from '@/components/staff/StatusFilter'
import { AssigneeFilter } from '@/components/staff/AssigneeFilter'
import { FlagFilterToggle } from '@/components/staff/FlagFilterToggle'
import { QueueMeta } from '@/components/staff/QueueMeta'
import { PermissionGate } from '@/components/ui/PermissionGate'

interface Props {
  status: string
  onStatusChange: (status: string) => void
  assignedTo: string | undefined
  onAssignedToChange: (housekeeperId: string | undefined) => void
  flagged: boolean
  onFlaggedChange: (flagged: boolean) => void
  deliveredToday: number
  lastUpdated: Date | null
  onRefresh: () => void | Promise<void>
}

export function QueueFilterBar({
  status, onStatusChange, assignedTo, onAssignedToChange, flagged, onFlaggedChange,
  deliveredToday, lastUpdated, onRefresh,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusFilter active={status} onChange={onStatusChange} />
        <QueueMeta
          deliveredToday={deliveredToday} lastUpdated={lastUpdated} onRefresh={onRefresh}
        />
      </div>
      {/* Second row of filters. Flagging is independent of status and open to
          any queue viewer, so it sits outside the roster permission gate. */}
      <div className="flex flex-wrap items-center gap-3">
        <FlagFilterToggle active={flagged} onChange={onFlaggedChange} />
        {/* Filtering by assignee means naming the housekeepers, so it needs the
            same permission as the roster itself. */}
        <PermissionGate permission="LAUNDRY_HOUSEKEEPERS_VIEW">
          <div className="w-full sm:w-60">
            <AssigneeFilter value={assignedTo} onChange={onAssignedToChange} />
          </div>
        </PermissionGate>
      </div>
    </div>
  )
}
