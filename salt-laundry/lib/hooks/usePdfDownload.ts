'use client'

import { useCallback, useState } from 'react'
import type { RefObject } from 'react'

export function usePdfDownload(targetRef: RefObject<HTMLElement | null>, filename: string) {
  const [isGenerating, setIsGenerating] = useState(false)

  const download = useCallback(async () => {
    const node = targetRef.current
    if (!node) return

    setIsGenerating(true)
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])
      const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF('p', 'pt', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgHeight = (canvas.height * pageWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position -= pageHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(filename)
    } finally {
      setIsGenerating(false)
    }
  }, [targetRef, filename])

  return { download, isGenerating }
}
