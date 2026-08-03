'use client'

import { useState } from 'react'
import { DEFAULT_SORT, type SortOrder } from '@/lib/constants/queue'

export function useQueueControls() {
  const [status, setStatus] = useState('ALL')
  const [sort, setSort] = useState<SortOrder>(DEFAULT_SORT)
  const [page, setPage] = useState(1)

  // Changing a filter or the sort order invalidates the current page number —
  // page 3 of "pending" has nothing to do with page 3 of "delivered".
  function withPageReset<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value)
      setPage(1)
    }
  }

  return {
    status,
    sort,
    page,
    setPage,
    setStatus: withPageReset(setStatus),
    setSort: withPageReset(setSort),
  }
}
