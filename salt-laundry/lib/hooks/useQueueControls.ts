'use client'

import { useState } from 'react'
import { usePagedList } from '@/lib/hooks/usePagedList'
import { DEFAULT_SORT, type SortOrder } from '@/lib/constants/queue'

export function useQueueControls() {
  const [status, setStatus] = useState('ALL')
  const [sort, setSort] = useState<SortOrder>(DEFAULT_SORT)
  const [flagged, setFlagged] = useState(false)
  const { page, setPage, withPageReset } = usePagedList()

  return {
    status,
    sort,
    flagged,
    page,
    setPage,
    setStatus: withPageReset(setStatus),
    setSort: withPageReset(setSort),
    setFlagged: withPageReset(setFlagged),
  }
}
