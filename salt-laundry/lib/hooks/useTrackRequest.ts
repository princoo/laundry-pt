'use client'

import { useCallback, useState } from 'react'
import type { TrackedRequest } from '@/lib/types/request'

export function useTrackRequest() {
  const [request, setRequest] = useState<TrackedRequest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState<{ room: string; reference: string } | null>(null)

  const search = useCallback(async (room: string, reference: string) => {
    setLastQuery({ room, reference })
    setIsLoading(true)
    setNotFound(false)
    setError(null)
    setRequest(null)
    try {
      const qs = new URLSearchParams({ room, reference })
      const res = await fetch(`/api/requests/track?${qs}`)
      if (res.status === 404) {
        setNotFound(true)
        return
      }
      if (!res.ok) throw new Error('Track request failed')
      setRequest(await res.json())
    } catch {
      setError('Failed to load. Try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const retry = useCallback(() => {
    if (lastQuery) search(lastQuery.room, lastQuery.reference)
  }, [lastQuery, search])

  return { request, isLoading, notFound, error, search, retry }
}
