'use client'

import { useCallback, useEffect, useState } from 'react'
import type { RequestStatus } from '@prisma/client'
import type { TrackedRequest } from '@/lib/types/request'

export function useRequestDetail(id: string) {
  const [request, setRequest] = useState<TrackedRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [loadedId, setLoadedId] = useState<string | null>(null)
  if (id !== loadedId && !isLoading) setIsLoading(true)

  const fetchRequest = useCallback(() => {
    let cancelled = false
    fetch(`/api/staff/requests/${id}`)
      .then(async (res) => {
        if (res.status === 404) {
          if (!cancelled) setNotFound(true)
          return
        }
        if (!res.ok) throw new Error('Failed to load request')
        const data = await res.json()
        if (!cancelled) {
          setRequest(data)
          setFetchError(null)
        }
      })
      .catch(() => { if (!cancelled) setFetchError('Failed to load request.') })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
          setLoadedId(id)
        }
      })
    return () => { cancelled = true }
  }, [id])

  useEffect(() => fetchRequest(), [fetchRequest])

  const updateStatus = useCallback(async (status: RequestStatus) => {
    setIsUpdating(true)
    setActionError(null)
    try {
      const res = await fetch(`/api/staff/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      fetchRequest()
    } catch {
      setActionError('Could not update status. Try again.')
    } finally {
      setIsUpdating(false)
    }
  }, [id, fetchRequest])

  return {
    request, isLoading, notFound, fetchError, isUpdating, actionError,
    updateStatus, refetch: fetchRequest, clearError: () => setActionError(null),
  }
}
