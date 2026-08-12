import type { Permission } from '@/lib/constants/permissions'

export interface NavLinkItem {
  href: string
  label: string
  exact?: boolean
  // What the destination needs. The nav filters on this instead of grouping by
  // role; the page and its API carry the same gate, because hiding a link is
  // not access control. Links with no permission are open to any session.
  permission?: Permission
}

export const STAFF_NAV_LINKS: NavLinkItem[] = [
  { href: '/staff', label: 'Dashboard', exact: true, permission: 'LAUNDRY_REQUEST_VIEW' },
  { href: '/staff/search', label: 'Search', permission: 'LAUNDRY_REQUESTS_SEARCH' },
  // Hidden for now — the page and its API still work at /staff/invoices.
  // { href: '/staff/invoices', label: 'Room invoice', permission: 'LAUNDRY_REQUESTS_INVOICES_VIEW' },
]

// Lives in the desktop account menu, and inline in the mobile menu.
export const PROFILE_NAV_LINK: NavLinkItem = { href: '/staff/profile', label: 'Profile' }

// Way back out of the dashboard to the public guest request form.
export const HOME_NAV_LINK: NavLinkItem = { href: '/', label: 'Guest form', exact: true }

// Grouped under "Manage". Each entry stands on its own permission now, so the
// group can show one link, all three, or disappear entirely.
export const MANAGE_NAV_LINKS: NavLinkItem[] = [
  { href: '/staff/items', label: 'Catalogue', permission: 'LAUNDRY_REQUEST_ITEMS_CATALOGUE_VIEW' },
  { href: '/staff/users', label: 'Users', permission: 'LAUNDRY_HOUSEKEEPERS_VIEW' },
  { href: '/staff/reports', label: 'Reports', permission: 'LAUNDRY_REPORTS_VIEW' },
]
