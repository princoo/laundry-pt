'use client'

import { usePathname } from 'next/navigation'
import { NavLink } from '@/components/ui/NavLink'
import { RoleBadge } from '@/components/ui/RoleBadge'
import { SignOutButton } from '@/components/staff/SignOutButton'
import { MobileManageSection } from '@/components/staff/MobileManageSection'
import { STAFF_NAV_LINKS, MANAGE_NAV_LINKS, PROFILE_NAV_LINK, HOME_NAV_LINK } from '@/lib/constants/navigation'
import { isLinkActive, visibleLinks } from '@/lib/utils/navigation'
import { usePermissions } from '@/lib/hooks/usePermissions'

interface Props {
  roleNames?: string[]
  userName?: string
  onNavigate: () => void
}

export function MobileNavMenu({ roleNames = [], userName, onNavigate }: Props) {
  const pathname = usePathname()
  const { permissions } = usePermissions()
  const manageLinks = visibleLinks(MANAGE_NAV_LINKS, permissions)

  return (
    <div className="md:hidden border-t border-[0.5px] border-salt-border px-4 py-3 flex flex-col gap-1 bg-white">
      {[...visibleLinks(STAFF_NAV_LINKS, permissions), PROFILE_NAV_LINK].map((link) => (
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

      {manageLinks.length > 0 && (
        <MobileManageSection links={manageLinks} onNavigate={onNavigate} />
      )}

      <NavLink
        href={HOME_NAV_LINK.href}
        active={isLinkActive(pathname, HOME_NAV_LINK)}
        onClick={onNavigate}
        className="block w-full"
      >
        {HOME_NAV_LINK.label}
      </NavLink>

      <div className="border-t border-salt-border mt-2 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {userName && <span className="text-sm text-salt-text truncate">{userName}</span>}
          <RoleBadge roleNames={roleNames} />
        </div>
        <SignOutButton />
      </div>
    </div>
  )
}
