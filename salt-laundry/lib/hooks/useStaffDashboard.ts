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
  assignedTo: { id: string; name: string | null } | null
  assignedAt: string | null
  acknowledgedAt: string | null
  collectedAt: string | null; completedAt: string | null
}

export interface QueueStats {
  pending: number
  collected: number
  inProgress: number
  ready: number
  deliveredToday: number
  unacknowledged: number
  unassigned: number
}

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

  const key = `${status}|${viewAll}|${assignedTo ?? ''}`
  if (key !== loadedKey && !isLoading) setIsLoading(true)

  const fetchData = useCallback(async () => {
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
      setRequests(requestsData.requests ?? [])
      setStats(await statsRes.json())
      setLastUpdated(new Date())
    } catch {
      setError('Failed to load requests.')
    } finally {
      setIsLoading(false)
      setLoadedKey(key)
    }
  }, [status, viewAll, assignedTo, key])

  useAutoRefresh(fetchData)

  return { requests, stats, isLoading, error, lastUpdated, refetch: fetchData }
}
