'use client'

import { useState } from 'react'

// Page state for a filtered listing. Filters are wrapped in withPageReset
// because a page number only means something within one set of filters —
// page 3 of "pending" has nothing to do with page 3 of "delivered".
export function usePagedList() {
  const [page, setPage] = useState(1)

  function withPageReset<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value)
      setPage(1)
    }
  }

  return { page, setPage, withPageReset }
}
