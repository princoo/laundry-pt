'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import type { NavLinkItem } from '@/lib/constants/navigation'

interface Props {
  label: string
  items: NavLinkItem[]
}

export function NavGroupDropdown({ label, items }: Props) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isActive = items.some((item) => pathname.startsWith(item.href))

  useEffect(() => {
    if (!isOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1 text-sm font-medium rounded-lg px-3 py-1.5 transition-colors ${
          isActive
            ? 'bg-salt-navy hover:bg-salt-navy-hover text-white'
            : 'text-salt-text-sec hover:text-salt-text'
        }`}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 w-44 bg-white border border-[0.5px] border-salt-border rounded-lg shadow-sm py-1.5 flex flex-col z-50">
          {items.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 text-sm ${active ? 'text-salt-navy font-medium' : 'text-salt-text-sec hover:text-salt-text'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
