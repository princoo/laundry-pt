'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

interface Position {
  top?: number
  bottom?: number
  left: number
  width: number
}

export function useSelectPopover(disabled?: boolean) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<Position | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = () => setIsOpen(false)

  const open = () => {
    if (disabled || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const openUpward = rect.bottom > window.innerHeight * 0.65
    setPosition(
      openUpward
        ? { bottom: window.innerHeight - rect.top + 4, left: rect.left, width: rect.width }
        : { top: rect.bottom + 4, left: rect.left, width: rect.width }
    )
    setIsOpen(true)
  }

  const toggle = () => (isOpen ? close() : open())

  useEffect(() => {
    if (!isOpen) return
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])
    const active = items.find((el) => el.getAttribute('aria-selected') === 'true')
    ;(active ?? items[0])?.focus()

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) close()
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { close(); triggerRef.current?.focus() }
    }
    const onScrollOrResize = () => close()
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [isOpen])

  const onPanelKeyDown = (e: KeyboardEvent) => {
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])
    const idx = items.findIndex((el) => el === document.activeElement)
    if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(idx + 1, items.length - 1)]?.focus() }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[Math.max(idx - 1, 0)]?.focus() }
  }

  return { isOpen, toggle, close, triggerRef, panelRef, position, onPanelKeyDown }
}
