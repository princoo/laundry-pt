import type { NavLinkItem } from '@/lib/constants/navigation'

export function isLinkActive(pathname: string, link: NavLinkItem) {
  return link.exact ? pathname === link.href : pathname.startsWith(link.href)
}
