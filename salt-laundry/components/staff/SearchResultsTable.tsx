'use client'

import { SearchResultRow } from '@/components/staff/SearchResultRow'
import { SearchTableFooter } from '@/components/staff/SearchTableFooter'
import type { SearchResult } from '@/lib/hooks/useSearchRequests'

interface Props {
  results: SearchResult[]
  billableTotal: number
  onSelectRequest: (id: string) => void
}

export function SearchResultsTable({ results, billableTotal, onSelectRequest }: Props) {
  const totalAll = results.reduce((sum, r) => sum + r.totalAmount, 0)

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm overflow-x-auto mt-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-salt-text-muted border-b border-[0.5px] border-salt-border">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Room</th>
            <th className="px-4 py-3 font-medium">Guest</th>
            <th className="px-4 py-3 font-medium">Service</th>
            <th className="px-4 py-3 font-medium">Items</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <SearchResultRow key={r.id} request={r} onClick={() => onSelectRequest(r.id)} />
          ))}
        </tbody>
      </table>
      <SearchTableFooter count={results.length} totalAll={totalAll} billableTotal={billableTotal} />
    </div>
  )
}
