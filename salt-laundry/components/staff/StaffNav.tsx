'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Shirt } from 'lucide-react'
import { NavLink } from '@/components/ui/NavLink'
import { UserMenu } from '@/components/staff/UserMenu'

interface Props {
  userName?: string
  role?: string
}

export function StaffNav({ userName, role }: Props) {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[0.5px] border-salt-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image src="/salt-logo.png" alt="Salt of Akagera" width={80} height={34} priority />
        <div className="h-8 w-px bg-salt-border" />
        <div className="flex items-center gap-2">
          <Shirt className="w-6 h-6 text-salt-green" />
          <span className="text-salt-navy text-lg font-black">Laundry Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {role === 'ADMIN' && (
          <>
            <NavLink href="/staff" active={pathname === '/staff'}>Dashboard</NavLink>
            <NavLink href="/staff/items" active={pathname.startsWith('/staff/items')}>
              Catalogue
            </NavLink>
            <NavLink href="/staff/users" active={pathname.startsWith('/staff/users')}>
              Users
            </NavLink>
          </>
        )}
        {userName && <UserMenu userName={userName} />}
      </div>
    </nav>
  )
}
