'use client'

import { useState } from 'react'
import { ChevronDown, FileText, SlidersHorizontal } from 'lucide-react'
import { LabeledField } from '@/components/ui/LabeledField'
import { RoomInvoiceFilterFields } from '@/components/staff/RoomInvoiceFilterFields'
import { INPUT_CLASSES } from '@/lib/constants/formStyles'
import { countActiveFilters } from '@/lib/utils/invoiceScope'
import type { RoomInvoiceFilters } from '@/lib/types/roomInvoice'

interface Props {
  filters: RoomInvoiceFilters
  onChange: (filters: RoomInvoiceFilters) => void
  onSearch: () => void
  onReset: () => void
  isLoading: boolean
}

export function RoomInvoiceFilterPanel({ filters, onChange, onSearch, onReset, isLoading }: Props) {
  const [showMore, setShowMore] = useState(false)
  const activeCount = countActiveFilters(filters)

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch() }}
      className="print:hidden bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm lg:sticky lg:top-[72px]"
    >
      <div className="flex items-center gap-2 px-4 sm:px-5 py-3.5 border-b-[0.5px] border-salt-border">
        <SlidersHorizontal className="w-4 h-4 text-salt-text-sec shrink-0" aria-hidden="true" />
        <h2 className="text-sm font-medium text-salt-text">Invoice filters</h2>
        {activeCount > 0 && (
          <span className="ml-auto text-[11px] text-salt-text-sec bg-salt-cream rounded-full px-2 py-0.5">
            {activeCount} applied
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <LabeledField label="Room number" htmlFor="invoice-room">
          <input id="invoice-room" value={filters.room} autoComplete="off"
            onChange={(e) => onChange({ ...filters, room: e.target.value })}
            placeholder="e.g. 204" className={INPUT_CLASSES} />
        </LabeledField>

        <button type="button" onClick={() => setShowMore((v) => !v)} aria-expanded={showMore}
          className="lg:hidden w-full flex items-center justify-between text-sm text-salt-text-sec hover:text-salt-navy transition-colors">
          {showMore ? 'Hide extra filters' : 'More filters'}
          <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
        </button>

        <div className={`${showMore ? 'block' : 'hidden'} lg:block`}>
          <RoomInvoiceFilterFields filters={filters} onChange={onChange} />
        </div>
      </div>

      <div className="px-4 sm:px-5 py-3.5 border-t-[0.5px] border-salt-border flex flex-col-reverse sm:flex-row sm:items-center gap-2">
        <button type="button" onClick={onReset}
          className="text-sm text-salt-text-sec hover:text-salt-text transition-colors py-2 sm:py-1">
          Reset
        </button>
        <button type="submit" disabled={isLoading || !filters.room.trim()}
          className="sm:ml-auto w-full sm:w-auto flex items-center justify-center gap-2 bg-salt-navy hover:bg-salt-navy-hover text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <FileText className="w-4 h-4" aria-hidden="true" />
          {isLoading ? 'Generating…' : 'Generate invoice'}
        </button>
      </div>
    </form>
  )
}
