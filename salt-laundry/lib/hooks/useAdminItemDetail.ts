'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AdminItem } from '@/lib/hooks/useAdminItems'
import { apiFetch } from '@/lib/apiClient'

export interface AdminItemDetail extends AdminItem {
  timesOrdered: number
  totalQuantity: number
  totalRevenue: number
}

export function useAdminItemDetail(id: string) {
  const [item, setItem] = useState<AdminItemDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const fetchItem = useCallback(() => {
    let cancelled = false
    apiFetch(`/api/admin/items/${id}`)
      .then(async (res) => {
        if (res.status === 404) {
          if (!cancelled) setNotFound(true)
          return
        }
        if (!res.ok) throw new Error('Failed to load item')
        const data = await res.json()
        if (!cancelled) {
          setItem(data)
          setFetchError(null)
        }
      })
      .catch(() => { if (!cancelled) setFetchError('Failed to load item.') })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [id])

  useEffect(() => fetchItem(), [fetchItem])

  const toggleActive = useCallback(async (isActive: boolean) => {
    setItem((prev) => (prev ? { ...prev, isActive } : prev))
    try {
      const res = await apiFetch(`/api/admin/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setItem((prev) => (prev ? { ...prev, isActive: !isActive } : prev))
      setActionError('Could not update item. Try again.')
    }
  }, [id])

  const removeItem = useCallback(async () => {
    setIsUpdating(true)
    setActionError(null)
    try {
      const res = await apiFetch(`/api/admin/items/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      return true
    } catch {
      setActionError('Could not remove item. Try again.')
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [id])

  return {
    item, isLoading, notFound, fetchError, isUpdating, actionError,
    toggleActive, removeItem, refetch: fetchItem, clearError: () => setActionError(null),
  }
}
