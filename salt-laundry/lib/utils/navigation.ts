import type { NavLinkItem } from '@/lib/constants/navigation'
import { hasPermission } from '@/lib/utils/permissions'

export function isLinkActive(pathname: string, link: NavLinkItem) {
  return link.exact ? pathname === link.href : pathname.startsWith(link.href)
}

// Drops the links this session cannot open, so an empty group can hide itself.
export function visibleLinks(links: NavLinkItem[], permissions: readonly string[]) {
  return links.filter((link) => !link.permission || hasPermission(permissions, link.permission))
}
