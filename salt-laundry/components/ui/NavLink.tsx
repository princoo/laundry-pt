import Link from 'next/link'
import type { ReactNode } from 'react'

const activeClasses =
  'bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white text-sm font-medium rounded-lg px-3 py-1.5'
const inactiveClasses = 'text-salt-text-sec hover:text-salt-text text-sm font-medium px-3 py-1.5'

interface Props {
  href: string
  active: boolean
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function NavLink({ href, active, children, onClick, className = '' }: Props) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${active ? activeClasses : inactiveClasses} ${className}`}
    >
      {children}
    </Link>
  )
}
