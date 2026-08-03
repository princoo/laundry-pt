'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Role } from '@prisma/client'

export interface OwnProfile {
  id: string
  name: string | null
  email: string
  role: Role
  mustChangePassword: boolean
}

export function useProfile() {
  const [profile, setProfile] = useState<OwnProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(() => {
    let cancelled = false

    fetch('/api/staff/profile')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load profile')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) {
          setProfile(data.user ?? null)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load your profile.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => fetchProfile(), [fetchProfile])

  return { profile, isLoading, error, refetch: fetchProfile }
}
