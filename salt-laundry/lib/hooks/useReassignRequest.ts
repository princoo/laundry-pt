'use client'

import { useState } from 'react'

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
      const res = await fetch(`/api/staff/requests/${requestId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ housekeeperId: selectedId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Could not reassign.')
      if (note.trim()) {
        await fetch(`/api/staff/requests/${requestId}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: `Reassigned: ${note.trim()}` }),
        })
      }
      onReassigned()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reassign.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { selectedId, setSelectedId, note, setNote, isSubmitting, error, submit }
}
