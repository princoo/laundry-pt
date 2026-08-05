'use client'

import { useEffect } from 'react'

// Deleting or deactivating the last row on the last page leaves the viewer
// stranded on a page that no longer exists — snap back to the final one.
// Lives apart from usePagedList because page feeds the fetch that produces
// totalPages, so the two can't be resolved in a single hook.
export function useClampPage(page: number, totalPages: number, setPage: (page: number) => void) {
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages, setPage])
}
