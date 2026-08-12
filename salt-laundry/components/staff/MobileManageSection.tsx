'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { NavLink } from '@/components/ui/NavLink'
import type { NavLinkItem } from '@/lib/constants/navigation'
import { isLinkActive } from '@/lib/utils/navigation'

interface Props {
  // Already filtered by the caller — this section only draws what it is given.
  links: NavLinkItem[]
  onNavigate: () => void
}

export function MobileManageSection({ links, onNavigate }: Props) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(links.some((link) => isLinkActive(pathname, link)))

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-salt-text-sec hover:text-salt-text text-sm font-medium px-3 py-1.5"
      >
        Manage
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pl-3 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={isLinkActive(pathname, link)}
              onClick={onNavigate}
              className="block w-full"
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
