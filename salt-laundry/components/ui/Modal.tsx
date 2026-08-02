'use client'

import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
  maxWidthClass?: string
}

export function Modal({ title, onClose, children, maxWidthClass = 'max-w-md' }: Props) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className={`bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm w-full ${maxWidthClass} max-h-[85vh] overflow-y-auto p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-salt-text">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-salt-text-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
