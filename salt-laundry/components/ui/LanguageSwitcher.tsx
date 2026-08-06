'use client'

import { useCallback, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { LANGUAGES } from '@/lib/constants/languages'
import { useLanguage } from '@/lib/hooks/useLanguage'
import { useClickOutside } from '@/lib/hooks/useClickOutside'

// Placeholder: it remembers the choice but nothing is translated yet.
export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setIsOpen(false), [])
  useClickOutside(menuRef, isOpen, close)

  const active = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Change language"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 text-sm font-medium text-salt-text-sec hover:text-salt-text rounded-lg px-2.5 py-1.5 transition-colors"
      >
        <span className="text-base leading-none shrink-0" aria-hidden="true">{active.flag}</span>
        {active.short}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 w-44 bg-white border border-[0.5px] border-salt-border rounded-lg shadow-sm py-1.5 flex flex-col z-50">
          {LANGUAGES.map((option) => {
            const selected = option.code === active.code
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  changeLanguage(option.code)
                  setIsOpen(false)
                }}
                className={`flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                  selected ? 'text-salt-navy font-medium' : 'text-salt-text-sec hover:text-salt-text'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none shrink-0" aria-hidden="true">{option.flag}</span>
                  <span>
                    {option.label}
                    <span className="text-salt-text-muted"> · {option.short}</span>
                  </span>
                </span>
                {selected && <Check className="w-4 h-4 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
