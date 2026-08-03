'use client'

import { useCallback, useRef, useState } from 'react'
import { useAutoRefresh } from '@/lib/hooks/useAutoRefresh'
import { buildQueueQuery, type QueueQuery } from '@/lib/utils/staffQueueQuery'
import { QUEUE_REFRESH_INTERVAL_MS } from '@/lib/constants/queue'
import type { QueueRequest, QueueStats } from '@/lib/types/staffDashboard'

export type { QueueRequest, QueueStats }

export function useStaffDashboard(params: QueueQuery) {
  const [requests, setRequests] = useState<QueueRequest[]>([])
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const latestRequestId = useRef(0)

  const query = buildQueueQuery(params)
  if (query !== loadedKey && !isLoading) setIsLoading(true)

  const fetchData = useCallback(async () => {
    // Overlapping calls can settle out of order (filter change mid-flight, tab
    // refocus) — only the most recently issued call is allowed to touch state.
    const requestId = ++latestRequestId.current
    setError(null)
    try {
      const [requestsRes, statsRes] = await Promise.all([
        fetch(`/api/staff/requests?${query}`),
        fetch('/api/staff/stats'),
      ])
      if (!requestsRes.ok || !statsRes.ok) throw new Error('Failed to load dashboard')
      const requestsData = await requestsRes.json()
      const statsData = await statsRes.json()
      if (requestId !== latestRequestId.current) return
      setRequests(requestsData.requests ?? [])
      setTotal(requestsData.total ?? 0)
      setTotalPages(Math.max(1, requestsData.totalPages ?? 1))
      setStats(statsData)
      setLastUpdated(new Date())
    } catch {
      if (requestId !== latestRequestId.current) return
      setError('Failed to load requests.')
    } finally {
      if (requestId === latestRequestId.current) {
        setIsLoading(false)
        setLoadedKey(query)
      }
    }
  }, [query])

  useAutoRefresh(fetchData, QUEUE_REFRESH_INTERVAL_MS)

  return { requests, stats, total, totalPages, isLoading, error, lastUpdated, refetch: fetchData }
}
