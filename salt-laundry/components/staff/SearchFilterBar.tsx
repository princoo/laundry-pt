'use client'

import type { KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import { STATUS_LABELS } from '@/lib/constants/statuses'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import type { SearchFilters } from '@/lib/hooks/useSearchRequests'
import type { RequestStatus, ServiceType } from '@prisma/client'

const STATUSES: RequestStatus[] = [
  'PENDING', 'COLLECTED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED',
]
const SERVICES: ServiceType[] = ['NORMAL', 'DRY_CLEAN', 'PRESSING']

const inputClasses =
  'border border-[0.5px] border-salt-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-salt-navy bg-white'

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
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs text-salt-text-muted mb-1">Room</label>
        <input value={filters.room} onChange={(e) => set('room', e.target.value)} onKeyDown={onEnter}
          placeholder="e.g. 214" className={`${inputClasses} w-32`} />
      </div>
      <div className="flex-1 min-w-[160px]">
        <label className="block text-xs text-salt-text-muted mb-1">Guest name</label>
        <input value={filters.name} onChange={(e) => set('name', e.target.value)} onKeyDown={onEnter}
          placeholder="e.g. J. Okafor" className={`${inputClasses} w-full`} />
      </div>
      <div>
        <label className="block text-xs text-salt-text-muted mb-1">Status</label>
        <select value={filters.status} onChange={(e) => set('status', e.target.value as RequestStatus | '')} className={inputClasses}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-salt-text-muted mb-1">Service type</label>
        <select value={filters.serviceType} onChange={(e) => set('serviceType', e.target.value as ServiceType | '')} className={inputClasses}>
          <option value="">All types</option>
          {SERVICES.map((s) => <option key={s} value={s}>{SERVICE_TYPE_LABELS[s]}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-salt-text-muted mb-1">From</label>
        <input type="date" value={filters.from} onChange={(e) => set('from', e.target.value)} className={inputClasses} />
      </div>
      <div>
        <label className="block text-xs text-salt-text-muted mb-1">To</label>
        <input type="date" value={filters.to} onChange={(e) => set('to', e.target.value)} className={inputClasses} />
      </div>
      <button type="button" onClick={onSearch} disabled={isLoading}
        className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2 text-sm font-medium disabled:opacity-60 flex items-center gap-2">
        <Search className="w-4 h-4" />
        {isLoading ? 'Searching…' : 'Search'}
      </button>
      <button type="button" onClick={onClear} className="text-salt-text-sec text-sm hover:text-salt-text">
        Clear
      </button>
    </div>
  )
}
