'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { LayoutDashboard, User } from 'lucide-react'

export function StaffAccessLink() {
  const { data: session, status } = useSession()

  if (status === 'loading') return null

  if (session?.user) {
    return (
      <Link
        href="/staff"
        className="flex items-center gap-1.5 bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white text-sm font-medium rounded-lg px-3 py-1.5"
      >
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </Link>
    )
  }

  return (
    <Link
      href="/staff/login"
      aria-label="Staff sign in"
      className="w-9 h-9 flex items-center justify-center rounded-full bg-salt-cream text-salt-text-sec hover:text-salt-text transition-colors"
    >
      <User className="w-5 h-5" />
    </Link>
  )
}
