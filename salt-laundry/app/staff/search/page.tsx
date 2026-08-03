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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-[22px] font-black text-salt-text">Search requests</h1>
      <p className="text-sm text-salt-text-muted mt-1 mb-5 sm:mb-6">Find requests by room number or guest name.</p>

      <SearchFilterBar filters={filters} onChange={setFilters} onSearch={search} onClear={clear} isLoading={isLoading} />

      <div className="mt-5 sm:mt-6">
        {isLoading ? (
          <LoadingSkeleton rows={4} height="h-14" rounded="rounded-lg" />
        ) : error ? (
          <FetchError message={error} onRetry={search} />
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
      </div>

      {selectedId && (
        <RequestDetailModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
