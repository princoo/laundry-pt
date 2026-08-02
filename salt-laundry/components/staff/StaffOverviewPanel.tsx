'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { StaffOverviewOnShiftRow } from '@/components/staff/StaffOverviewOnShiftRow'
import { StaffOverviewOffShiftRow } from '@/components/staff/StaffOverviewOffShiftRow'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { useStaffOverview } from '@/lib/hooks/useStaffOverview'

interface Props {
  onViewTasks: (housekeeperId: string) => void
}

export function StaffOverviewPanel({ onViewTasks }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [showOffShift, setShowOffShift] = useState(false)
  const { onShift, offShift, markOnShift, markOffShift, toastMessage, dismissToast } =
    useStaffOverview(isOpen)

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm mb-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-salt-text"
      >
        Staff overview
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="border-t border-[0.5px] border-salt-border px-5 py-3">
          <div className="text-xs uppercase text-salt-text-muted mb-2">
            On shift ({onShift.length})
          </div>
          {onShift.map((row) => (
            <StaffOverviewOnShiftRow
              key={row.id}
              {...row}
              onViewTasks={() => onViewTasks(row.id)}
              onMarkOffShift={() => markOffShift(row.id)}
            />
          ))}
          {onShift.length === 0 && (
            <p className="text-sm text-salt-text-muted py-2">No one is on shift.</p>
          )}

          <button
            type="button"
            onClick={() => setShowOffShift((prev) => !prev)}
            className="text-xs uppercase text-salt-text-muted mt-4 mb-2 flex items-center gap-1"
          >
            Off shift ({offShift.length})
            <ChevronDown className={`w-3 h-3 transition-transform ${showOffShift ? 'rotate-180' : ''}`} />
          </button>
          {showOffShift && offShift.map((row) => (
            <StaffOverviewOffShiftRow
              key={row.id}
              name={row.name}
              onMarkOnShift={() => markOnShift(row.id)}
            />
          ))}
        </div>
      )}

      <ErrorToast message={toastMessage} onDismiss={dismissToast} variant="success" />
    </div>
  )
}
