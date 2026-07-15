'use client'

import { useCallback, useState } from 'react'
import type { TrackedRequest } from '@/lib/types/request'

export function useRoomRequests() {
  const [requests, setRequests] = useState<TrackedRequest[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRoom, setLastRoom] = useState('')

  const search = useCallback(async (room: string) => {
    setLastRoom(room)
    setIsLoading(true)
    setError(null)
    setRequests(null)
    try {
      const qs = new URLSearchParams({ room })
      const res = await fetch(`/api/requests/track/by-room?${qs}`)
      if (!res.ok) throw new Error('Lookup failed')
      const data = await res.json()
      setRequests(data.requests)
    } catch {
      setError('Failed to load. Try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const retry = useCallback(() => {
    if (lastRoom) search(lastRoom)
  }, [lastRoom, search])

  return { requests, isLoading, error, search, retry }
}
