'use client'

import { useCallback, useState } from 'react'
import type { RefObject } from 'react'

// Captures a card element as a PNG image (the whole branded card, not just the
// bare QR) using html2canvas — the same library the invoice PDF export uses.
export function useCardImageExport(targetRef: RefObject<HTMLElement | null>) {
  const [exporting, setExporting] = useState(false)

  const exportPng = useCallback(
    async (filename: string) => {
      const node = targetRef.current
      if (!node) return

      setExporting(true)
      try {
        const { default: html2canvas } = await import('html2canvas')
        const canvas = await html2canvas(node, {
          scale: 3, // sharp enough for the QR to stay scannable when printed
          backgroundColor: '#ffffff',
          useCORS: true,
        })
        const link = document.createElement('a')
        link.download = filename.endsWith('.png') ? filename : `${filename}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      } finally {
        setExporting(false)
      }
    },
    [targetRef],
  )

  return { exportPng, exporting }
}
