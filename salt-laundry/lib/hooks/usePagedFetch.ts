'use client'

import { useCallback, useEffect, useState } from 'react'

interface PageMeta {
  total: number
  totalPages: number
  activeCount: number
}

const EMPTY_META: PageMeta = { total: 0, totalPages: 1, activeCount: 0 }

// Shared loader for the admin listings. Every paged endpoint answers with the
// same envelope — { [rowsKey]: [...], total, totalPages, activeCount } — so the
// only things that vary are the path, that key, and the failure message.
export function usePagedFetch<T>(
  path: string, rowsKey: string, page: number, errorMessage: string
) {
  const [rows, setRows] = useState<T[]>([])
  const [meta, setMeta] = useState<PageMeta>(EMPTY_META)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    let cancelled = false

    fetch(`${path}?page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error(errorMessage)
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setRows(data[rowsKey] ?? [])
        setMeta({
          total: data.total ?? 0,
          totalPages: Math.max(1, data.totalPages ?? 1),
          activeCount: data.activeCount ?? 0,
        })
        setError(null)
      })
      .catch(() => {
        if (!cancelled) setError(errorMessage)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [path, rowsKey, page, errorMessage])

  useEffect(() => refetch(), [refetch])

  // Keeps an optimistic row edit and the server-derived active count in step
  // without spending a refetch on it.
  const adjustActiveCount = useCallback((delta: number) => {
    setMeta((prev) => ({ ...prev, activeCount: prev.activeCount + delta }))
  }, [])

  return { rows, setRows, ...meta, adjustActiveCount, isLoading, error, refetch }
}
