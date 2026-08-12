'use client'

import { useState, useCallback } from 'react'
import { apiFetch } from '@/lib/apiClient'

// Raising and withdrawing a "needs changes" flag. Both answer with the same
// shape, so the caller refetches the detail rather than patching state locally —
// flagging also writes a note, and the notes list has to pick that up.
export function useRequestFlag(requestId: string, onChanged: () => void) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = useCallback(
    async (init: RequestInit) => {
      setIsSaving(true)
      setError(null)
      try {
        const response = await apiFetch(`/api/staff/requests/${requestId}/flag`, init)
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          setError(data?.error ?? 'Something went wrong. Try again.')
          return false
        }
        onChanged()
        return true
      } catch {
        setError('Something went wrong. Try again.')
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [requestId, onChanged]
  )

  const flag = useCallback(
    (reason: string) =>
      send({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      }),
    [send]
  )

  const unflag = useCallback(() => send({ method: 'DELETE' }), [send])

  return { flag, unflag, isSaving, error, dismissError: () => setError(null) }
}
