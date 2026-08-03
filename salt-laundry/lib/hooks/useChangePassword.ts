'use client'

import { useCallback, useState } from 'react'
import type { ChangePasswordValues } from '@/lib/validations/profile.schema'

// Shared by the forced change-password page and the profile page — both send
// the same PATCH and surface the same errors.
export function useChangePassword() {
  const [error, setError] = useState<string | null>(null)

  const changePassword = useCallback(async (values: ChangePasswordValues) => {
    setError(null)
    const res = await fetch('/api/staff/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Could not update password. Try again.')
      return false
    }
    return true
  }, [])

  return { changePassword, error, clearError: () => setError(null) }
}
