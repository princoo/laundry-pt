export interface NavLinkItem {
  href: string
  label: string
  exact?: boolean
}

export const STAFF_NAV_LINKS: NavLinkItem[] = [
  { href: '/staff', label: 'Dashboard', exact: true },
  { href: '/staff/search', label: 'Search' },
  { href: '/staff/invoices', label: 'Room invoice' },
]

// Lives in the desktop account menu, and inline in the mobile menu.
export const PROFILE_NAV_LINK: NavLinkItem = { href: '/staff/profile', label: 'Profile' }

// Way back out of the dashboard to the public guest request form.
export const HOME_NAV_LINK: NavLinkItem = { href: '/', label: 'Guest form', exact: true }

export const ADMIN_NAV_LINKS: NavLinkItem[] = [
  { href: '/staff/items', label: 'Catalogue' },
  { href: '/staff/users', label: 'Users' },
  { href: '/staff/reports', label: 'Reports' },
]
