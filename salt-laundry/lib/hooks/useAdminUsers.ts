'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Role } from '@prisma/client'

export interface AdminUser {
  id: string
  name: string | null
  email: string
  role: Role
  isActive: boolean
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(() => {
    let cancelled = false

    fetch('/api/admin/users')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load users')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) {
          setUsers(data.users ?? [])
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load staff accounts.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => fetchUsers(), [fetchUsers])

  return { users, isLoading, error, refetch: fetchUsers }
}
