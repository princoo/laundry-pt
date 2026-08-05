'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Shirt, Menu, X } from 'lucide-react'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { NavLink } from '@/components/ui/NavLink'
import { NavGroupDropdown } from '@/components/staff/NavGroupDropdown'
import { RoleBadge } from '@/components/staff/RoleBadge'
import { UserMenu } from '@/components/staff/UserMenu'
import { NotificationBell } from '@/components/staff/NotificationBell'
import { MobileNavMenu } from '@/components/staff/MobileNavMenu'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { STAFF_NAV_LINKS, ADMIN_NAV_LINKS } from '@/lib/constants/navigation'

interface Props {
  userName?: string
  role?: string
}

export function StaffNav({ userName, role }: Props) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <nav className="print:hidden sticky top-0 z-50 bg-white border-b border-[0.5px] border-salt-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <BrandLogo className="shrink-0" />
          <div className="h-8 w-px bg-salt-border hidden sm:block" />
          <div className="flex items-center gap-2 min-w-0">
            <Shirt className="w-6 h-6 text-salt-green shrink-0" />
            <span className="text-salt-navy text-lg font-black truncate">Laundry Dashboard</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {STAFF_NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={link.exact ? pathname === link.href : pathname.startsWith(link.href)}
            >
              {link.label}
            </NavLink>
          ))}
          {role === 'ADMIN' && <NavGroupDropdown label="Manage" items={ADMIN_NAV_LINKS} />}
          <LanguageSwitcher />
          <NotificationBell />
          {role && <RoleBadge role={role} />}
          {userName && <UserMenu userName={userName} />}
        </div>

        <div className="flex md:hidden items-center gap-1 shrink-0">
          <LanguageSwitcher />
          <NotificationBell />
          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Menu"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-salt-cream text-salt-text-sec"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <MobileNavMenu role={role} userName={userName} onNavigate={() => setIsMobileOpen(false)} />
      )}
    </nav>
  )
}
