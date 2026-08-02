'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface Props {
  message: string
  onDismiss: () => void
}

export function ToastNotification({ message, onDismiss }: Props) {
  const [visible, setVisible] = useState(false)
  const onDismissRef = useRef(onDismiss)

  useEffect(() => {
    onDismissRef.current = onDismiss
  })

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    const timeout = setTimeout(() => onDismissRef.current(), 5000)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div
      className={`bg-salt-navy text-white rounded-xl px-5 py-4 shadow-lg flex items-center gap-4 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <span className="text-sm">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-white/70 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
