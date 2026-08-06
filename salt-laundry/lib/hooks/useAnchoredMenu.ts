'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useClickOutside } from '@/lib/hooks/useClickOutside'

interface Anchor {
  top: number
  right: number
}

const GAP = 4

// A dropdown that hangs off a trigger button. It's placed with fixed coordinates
// measured from the trigger, because table rows sit inside a scrolling container
// that would clip an absolutely positioned menu. Fixed coordinates don't move
// with the page, so the menu re-measures while it's open and stays glued to its
// trigger instead of drifting away from it.
export function useAnchoredMenu() {
  const [anchor, setAnchor] = useState<Anchor | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setAnchor(null), [])

  const measure = useCallback((): Anchor | null => {
    const box = triggerRef.current?.getBoundingClientRect()
    if (!box) return null
    return { top: box.bottom + GAP, right: window.innerWidth - box.right }
  }, [])

  const toggle = useCallback(() => {
    setAnchor((current) => (current ? null : measure()))
  }, [measure])

  const isOpen = anchor !== null
  useClickOutside(containerRef, isOpen, close)

  useEffect(() => {
    if (!isOpen) return
    const follow = () => setAnchor(measure())
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    // Capture phase: the scroll can happen on the table container, not the window.
    window.addEventListener('scroll', follow, true)
    window.addEventListener('resize', follow)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('scroll', follow, true)
      window.removeEventListener('resize', follow)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, measure, close])

  return { anchor, isOpen, containerRef, triggerRef, close, toggle }
}
