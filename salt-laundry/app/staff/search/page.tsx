'use client'

import { useState } from 'react'
import { SearchFilterBar } from '@/components/staff/SearchFilterBar'
import { SearchSummaryBar } from '@/components/staff/SearchSummaryBar'
import { SearchResultsTable } from '@/components/staff/SearchResultsTable'
import { SearchStateMessage } from '@/components/staff/SearchStateMessage'
import { RequestDetailModal } from '@/components/staff/RequestDetailModal'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { useSearchRequests } from '@/lib/hooks/useSearchRequests'

export default function StaffSearchPage() {
  const { filters, setFilters, results, billableTotal, isLoading, error, search, clear } = useSearchRequests()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-[22px] font-black text-salt-text">Search requests</h1>
      <p className="text-sm text-salt-text-muted mt-1">Find requests by room number or guest name.</p>

      <div className="mt-4">
        <SearchFilterBar filters={filters} onChange={setFilters} onSearch={search} onClear={clear} isLoading={isLoading} />
      </div>

      {isLoading ? (
        <div className="mt-6"><LoadingSkeleton rows={4} height="h-14" rounded="rounded-lg" /></div>
      ) : error ? (
        <div className="mt-6"><FetchError message={error} onRetry={search} /></div>
      ) : results === null ? (
        <SearchStateMessage variant="idle" />
      ) : results.length === 0 ? (
        <SearchStateMessage variant="empty" />
      ) : (
        <>
          <SearchSummaryBar count={results.length} room={filters.room.trim() || undefined} billableTotal={billableTotal} />
          <SearchResultsTable results={results} billableTotal={billableTotal} onSelectRequest={setSelectedId} />
        </>
      )}

      {selectedId && (
        <RequestDetailModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
