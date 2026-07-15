'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ServiceType } from '@prisma/client'

export interface LaundryItemOption {
  id: string
  nameEn: string
  nameFr: string
  price: number
}

export function useItems(serviceType: ServiceType) {
  const [items, setItems] = useState<LaundryItemOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadedServiceType, setLoadedServiceType] = useState<ServiceType | null>(null)

  if (serviceType !== loadedServiceType && !isLoading) {
    setIsLoading(true)
  }

  const fetchItems = useCallback(() => {
    let cancelled = false

    fetch(`/api/items?service=${serviceType}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load items')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) {
          setItems(data.items ?? [])
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load items.')
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
          setLoadedServiceType(serviceType)
        }
      })

    return () => {
      cancelled = true
    }
  }, [serviceType])

  useEffect(() => fetchItems(), [fetchItems])

  return { items, isLoading, error, refetch: fetchItems }
}
