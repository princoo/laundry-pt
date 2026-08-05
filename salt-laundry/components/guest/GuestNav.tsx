'use client'

import { useState } from 'react'
import { Shirt, Menu, X } from 'lucide-react'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { NavLink } from '@/components/ui/NavLink'
import { StaffAccessLink } from '@/components/guest/StaffAccessLink'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

interface Props {
  active: 'new' | 'track'
}

export function GuestNav({ active }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[0.5px] border-salt-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo />
          <div className="h-8 w-px bg-salt-border hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <Shirt className="w-6 h-6 text-salt-green" />
            <span className="text-salt-navy text-lg font-black">Laundry Service</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <NavLink href="/" active={active === 'new'}>New request</NavLink>
          <NavLink href="/track" active={active === 'track'}>Track order</NavLink>
          <div className="h-6 w-px bg-salt-border mx-1" />
          <LanguageSwitcher />
          <StaffAccessLink />
        </div>

        {/* Guests need the language picker without opening the menu first. */}
        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-salt-text-sec hover:text-salt-text transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-[0.5px] border-salt-border px-4 py-3 flex flex-col gap-2">
          <NavLink href="/" active={active === 'new'} onClick={() => setIsOpen(false)}>
            New request
          </NavLink>
          <NavLink href="/track" active={active === 'track'} onClick={() => setIsOpen(false)}>
            Track order
          </NavLink>
          <div className="border-t border-[0.5px] border-salt-border my-1" />
          <StaffAccessLink />
        </div>
      )}
    </nav>
  )
}
