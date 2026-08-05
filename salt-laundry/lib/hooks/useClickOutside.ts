'use client'

import { useEffect, type RefObject } from 'react'

// Closes a dropdown when the next click lands anywhere outside its container.
// Listener is only attached while the menu is actually open.
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onOutside: () => void
) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, isOpen, onOutside])
}
