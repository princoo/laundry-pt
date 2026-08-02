'use client'

import { useEffect } from 'react'

interface Props {
  message: string | null
  onDismiss: () => void
  variant?: 'error' | 'success'
}

export function ErrorToast({ message, onDismiss, variant = 'error' }: Props) {
  useEffect(() => {
    if (!message) return
    const id = setTimeout(onDismiss, 4000)
    return () => clearTimeout(id)
  }, [message, onDismiss])

  if (!message) return null

  const bgClass = variant === 'success' ? 'bg-salt-green' : 'bg-red-600'

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 ${bgClass} text-white text-sm px-4 py-3 rounded-lg shadow-sm`}>
      {message}
    </div>
  )
}
