'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { User, ArrowLeft } from 'lucide-react'
import { SignOutButton } from '@/components/staff/SignOutButton'
import { PROFILE_NAV_LINK, HOME_NAV_LINK } from '@/lib/constants/navigation'

interface Props {
  userName: string
}

export function UserMenu({ userName }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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
        aria-label="Account menu"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-salt-cream text-salt-text-sec hover:text-salt-text transition-colors"
      >
        <User className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 w-48 bg-white border border-[0.5px] border-salt-border rounded-lg shadow-sm py-2 flex flex-col">
          <p className="px-3 py-1.5 text-sm text-salt-text truncate">{userName}</p>
          <div className="border-t-[0.5px] border-salt-border my-1" />
          <Link
            href={PROFILE_NAV_LINK.href}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-salt-text-sec hover:text-salt-text transition-colors"
          >
            <User className="w-4 h-4" />
            {PROFILE_NAV_LINK.label}
          </Link>
          <Link
            href={HOME_NAV_LINK.href}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-salt-text-sec hover:text-salt-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {HOME_NAV_LINK.label}
          </Link>
          <SignOutButton />
        </div>
      )}
    </div>
  )
}
