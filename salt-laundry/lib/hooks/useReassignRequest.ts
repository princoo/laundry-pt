'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/apiClient'

export function useReassignRequest(requestId: string, onReassigned: () => void, onClose: () => void) {
  const [selectedId, setSelectedId] = useState('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!selectedId) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await apiFetch(`/api/staff/requests/${requestId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ housekeeperId: selectedId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Could not save the assignment — try again.')
      if (note.trim()) {
        await apiFetch(`/api/staff/requests/${requestId}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: `Assigned: ${note.trim()}` }),
        })
      }
      onReassigned()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the assignment — try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { selectedId, setSelectedId, note, setNote, isSubmitting, error, submit }
}
