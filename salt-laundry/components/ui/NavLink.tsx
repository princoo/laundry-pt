import Link from 'next/link'
import type { ReactNode } from 'react'

const activeClasses =
  'bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white text-sm font-medium rounded-lg px-3 py-1.5'
const inactiveClasses = 'text-salt-text-sec hover:text-salt-text text-sm font-medium px-3 py-1.5'

interface Props {
  href: string
  active: boolean
  children: ReactNode
}

export function NavLink({ href, active, children }: Props) {
  return (
    <Link href={href} className={active ? activeClasses : inactiveClasses}>
      {children}
    </Link>
  )
}
