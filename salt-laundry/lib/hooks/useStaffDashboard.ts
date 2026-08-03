'use client'

import { useCallback, useRef, useState } from 'react'
import { useAutoRefresh } from '@/lib/hooks/useAutoRefresh'
import type { QueueRequest, QueueStats } from '@/lib/types/staffDashboard'

export type { QueueRequest, QueueStats }

interface DashboardParams {
  status?: string
  viewAll?: boolean
  assignedTo?: string
}

export function useStaffDashboard({ status = 'ALL', viewAll = false, assignedTo }: DashboardParams) {
  const [requests, setRequests] = useState<QueueRequest[]>([])
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const latestRequestId = useRef(0)

  const key = `${status}|${viewAll}|${assignedTo ?? ''}`
  if (key !== loadedKey && !isLoading) setIsLoading(true)

  const fetchData = useCallback(async () => {
    // Overlapping calls can settle out of order (filter change mid-flight, tab
    // refocus) — only the most recently issued call is allowed to touch state.
    const requestId = ++latestRequestId.current
    setError(null)
    try {
      const params = new URLSearchParams()
      if (status !== 'ALL') params.set('status', status)
      if (viewAll) params.set('view', 'all')
      if (assignedTo) params.set('assignedTo', assignedTo)
      const qs = params.toString() ? `?${params.toString()}` : ''
      const [requestsRes, statsRes] = await Promise.all([
        fetch(`/api/staff/requests${qs}`),
        fetch('/api/staff/stats'),
      ])
      if (!requestsRes.ok || !statsRes.ok) throw new Error('Failed to load dashboard')
      const requestsData = await requestsRes.json()
      const statsData = await statsRes.json()
      if (requestId !== latestRequestId.current) return
      setRequests(requestsData.requests ?? [])
      setStats(statsData)
      setLastUpdated(new Date())
    } catch {
      if (requestId !== latestRequestId.current) return
      setError('Failed to load requests.')
    } finally {
      if (requestId === latestRequestId.current) {
        setIsLoading(false)
        setLoadedKey(key)
      }
    }
  }, [status, viewAll, assignedTo, key])

  useAutoRefresh(fetchData)

  return { requests, stats, isLoading, error, lastUpdated, refetch: fetchData }
}
