'use client'

import { useCallback, useEffect, useState } from 'react'

export interface AdminItem {
  id: string
  nameEn: string
  nameFr: string
  priceNormal: number | null
  priceDryClean: number | null
  pricePressing: number | null
  isActive: boolean
  sortOrder: number
}

export function useAdminItems() {
  const [items, setItems] = useState<AdminItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(() => {
    let cancelled = false

    fetch('/api/admin/items')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load items')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) {
          setItems(data.items ?? [])
          setFetchError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setFetchError('Failed to load items.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => fetchItems(), [fetchItems])

  const toggleActive = useCallback(async (id: string, isActive: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isActive } : i)))
    try {
      const res = await fetch(`/api/admin/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isActive: !isActive } : i)))
      setError('Could not update item. Try again.')
    }
  }, [])

  return {
    items,
    isLoading,
    fetchError,
    error,
    refetch: fetchItems,
    toggleActive,
    clearError: () => setError(null),
  }
}
