'use client'

import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'
import { useSelectPopover } from '@/lib/hooks/useSelectPopover'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function Select({ value, onChange, options, placeholder = 'Select…', disabled, className = '' }: Props) {
  const { isOpen, toggle, close, triggerRef, panelRef, position, onPanelKeyDown } = useSelectPopover(disabled)
  const selected = options.find((o) => o.value === value)

  const selectOption = (v: string) => {
    onChange(v)
    close()
    triggerRef.current?.focus()
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onClick={toggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm bg-white text-left flex items-center justify-between gap-2 focus:outline-none focus:border-salt-navy disabled:opacity-60 ${className}`}
      >
        <span className={`truncate ${selected ? 'text-salt-text' : 'text-salt-text-muted'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-salt-text-muted shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && position && createPortal(
        <div
          ref={panelRef}
          role="listbox"
          onKeyDown={onPanelKeyDown}
          style={{ position: 'fixed', ...position }}
          className="z-50 max-h-64 overflow-y-auto bg-white border border-[0.5px] border-salt-border rounded-lg shadow-sm py-1"
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => selectOption(o.value)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left text-salt-text hover:bg-salt-cream focus:bg-salt-cream focus:outline-none"
            >
              {o.label}
              {o.value === value && <Check className="w-4 h-4 text-salt-navy shrink-0" />}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}
