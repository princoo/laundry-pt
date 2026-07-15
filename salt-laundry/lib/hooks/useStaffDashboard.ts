'use client'

import { useCallback, useState } from 'react'
import { useAutoRefresh } from '@/lib/hooks/useAutoRefresh'
import type { RequestStatus, ServiceType } from '@prisma/client'

export interface QueueRequest {
  id: string
  reference: string
  roomNumber: string
  guestName: string | null
  serviceType: ServiceType
  isExpress: boolean
  status: RequestStatus
  totalAmount: number
  createdAt: string
  totalItems: number
  itemNames: string[]
}

export interface QueueStats {
  pending: number
  collected: number
  inProgress: number
  ready: number
  deliveredToday: number
}

export function useStaffDashboard(activeFilter: string) {
  const [requests, setRequests] = useState<QueueRequest[]>([])
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loadedFilter, setLoadedFilter] = useState<string | null>(null)

  if (activeFilter !== loadedFilter && !isLoading) {
    setIsLoading(true)
  }

  const fetchData = useCallback(async () => {
    setError(null)
    try {
      const qs = activeFilter !== 'ALL' ? `?status=${activeFilter}` : ''
      const [requestsRes, statsRes] = await Promise.all([
        fetch(`/api/staff/requests${qs}`),
        fetch('/api/staff/stats'),
      ])
      if (!requestsRes.ok || !statsRes.ok) throw new Error('Failed to load dashboard')
      const requestsData = await requestsRes.json()
      const statsData = await statsRes.json()
      setRequests(requestsData.requests ?? [])
      setStats(statsData)
      setLastUpdated(new Date())
    } catch {
      setError('Failed to load requests.')
    } finally {
      setIsLoading(false)
      setLoadedFilter(activeFilter)
    }
  }, [activeFilter])

  useAutoRefresh(fetchData)

  return { requests, stats, isLoading, error, lastUpdated, refetch: fetchData }
}
