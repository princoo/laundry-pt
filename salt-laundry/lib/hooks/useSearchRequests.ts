'use client'

import { useCallback, useEffect, useState } from 'react'
import type { RequestStatus, ServiceType } from '@prisma/client'

export interface SearchFilters {
  room: string
  name: string
  status: RequestStatus | ''
  serviceType: ServiceType | ''
  from: string
  to: string
}

export interface SearchResult {
  id: string
  roomNumber: string
  guestName: string | null
  serviceTypes: ServiceType[]
  isExpress: boolean
  status: RequestStatus
  totalAmount: number
  createdAt: string
  totalItems: number
}

const EMPTY_FILTERS: SearchFilters = {
  room: '', name: '', status: '', serviceType: '', from: '', to: '',
}

function buildQuery(filters: SearchFilters) {
  const qs = new URLSearchParams()
  if (filters.room.trim()) qs.set('room', filters.room.trim())
  if (filters.name.trim()) qs.set('name', filters.name.trim())
  if (filters.status) qs.set('status', filters.status)
  if (filters.serviceType) qs.set('serviceType', filters.serviceType)
  if (filters.from) qs.set('from', filters.from)
  if (filters.to) qs.set('to', filters.to)
  return qs.toString()
}

export function useSearchRequests() {
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS)
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [billableTotal, setBillableTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const runSearch = useCallback(async (activeFilters: SearchFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/staff/search?${buildQuery(activeFilters)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setResults(data.requests)
      setBillableTotal(data.billableTotal)
    } catch {
      setError('Failed to search. Try again.')
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setFilters(EMPTY_FILTERS)
    setError(null)
    runSearch(EMPTY_FILTERS)
  }, [runSearch])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    runSearch(EMPTY_FILTERS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    filters, setFilters,
    results, billableTotal, isLoading, error,
    search: () => runSearch(filters),
    clear,
  }
}
