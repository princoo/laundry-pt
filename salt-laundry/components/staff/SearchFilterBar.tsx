'use client'

import type { KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { STATUS_LABELS } from '@/lib/constants/statuses'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import type { SearchFilters } from '@/lib/hooks/useSearchRequests'
import type { RequestStatus, ServiceType } from '@prisma/client'

const STATUSES: RequestStatus[] = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED',
]
const SERVICES: ServiceType[] = ['NORMAL', 'DRY_CLEAN', 'PRESSING']

const inputClasses =
  'w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-salt-navy bg-white'

interface Props {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
  onSearch: () => void
  onClear: () => void
  isLoading: boolean
}

export function SearchFilterBar({ filters, onChange, onSearch, onClear, isLoading }: Props) {
  const set = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) =>
    onChange({ ...filters, [key]: value })

  const onEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className="block text-xs text-salt-text-muted mb-1">Room</label>
          <input value={filters.room} onChange={(e) => set('room', e.target.value)} onKeyDown={onEnter}
            placeholder="e.g. 214" className={inputClasses} />
        </div>
        <div>
          <label className="block text-xs text-salt-text-muted mb-1">Guest name</label>
          <input value={filters.name} onChange={(e) => set('name', e.target.value)} onKeyDown={onEnter}
            placeholder="e.g. J. Okafor" className={inputClasses} />
        </div>
        <div>
          <label className="block text-xs text-salt-text-muted mb-1">Status</label>
          <Select value={filters.status} onChange={(v) => set('status', v as RequestStatus | '')}
            options={[{ value: '', label: 'All statuses' }, ...STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))]} />
        </div>
        <div>
          <label className="block text-xs text-salt-text-muted mb-1">Item service type</label>
          <Select value={filters.serviceType} onChange={(v) => set('serviceType', v as ServiceType | '')}
            options={[{ value: '', label: 'All types' }, ...SERVICES.map((s) => ({ value: s, label: SERVICE_TYPE_LABELS[s] }))]} />
        </div>
        <div>
          <label className="block text-xs text-salt-text-muted mb-1">From</label>
          <input type="date" value={filters.from} onChange={(e) => set('from', e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className="block text-xs text-salt-text-muted mb-1">To</label>
          <input type="date" value={filters.to} onChange={(e) => set('to', e.target.value)} className={inputClasses} />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 mt-4 pt-4 border-t border-salt-border">
        <button type="button" onClick={onClear} className="text-salt-text-sec text-sm hover:text-salt-text">
          Clear
        </button>
        <button type="button" onClick={onSearch} disabled={isLoading}
          className="w-full sm:w-auto bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2">
          <Search className="w-4 h-4" />
          {isLoading ? 'Searching…' : 'Search'}
        </button>
      </div>
    </div>
  )
}
