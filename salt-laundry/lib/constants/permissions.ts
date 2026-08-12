// The permission strings SOA issues, copied character for character.
//
// The naming is inconsistent on SOA's side — LAUNDRY_REQUEST_VIEW is singular
// while LAUNDRY_REQUESTS_SEARCH is plural, and QR_CODE_GENERATION carries no
// prefix because it is shared with other SOA sub-systems. Do not normalise
// them. A "corrected" string simply never matches, which fails closed and is
// very hard to spot.
//
// Three of these gate features that do not exist yet — marked below. They are
// deliberate, not mistakes: defined so the set matches SOA exactly, left
// unused, and wired up when the feature lands. See docs/soa-migration.md.
export const PERMISSIONS = [
  'LAUNDRY_REQUEST_VIEW',
  'LAUNDRY_REQUESTS_VIEW_ALL',
  'LAUNDRY_REQUESTS_INVOICES_VIEW',
  'LAUNDRY_REQUESTS_INVOICES_PRINT',
  'LAUNDRY_REQUESTS_SEARCH',
  'LAUNDRY_REQUEST_PROCESS',
  // Awaiting its feature: staff editing a request at any status. This is NOT
  // /api/requests/[id]/edit, which is the public guest flow — do not gate that
  // route with it.
  'LAUNDRY_REQUEST_EDIT',
  'LAUNDRY_REQUEST_HOUSEKEEPER_ASSIGN',
  'LAUNDRY_REQUEST_ITEMS_CATALOGUE_VIEW',
  'LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE',
  'LAUNDRY_HOUSEKEEPERS_VIEW',
  'LAUNDRY_HOUSEKEEPERS_SHIFTS_MANAGE',
  'LAUNDRY_REPORTS_VIEW',
  // Awaiting its feature: PDF export on the reports page.
  'LAUNDRY_REPORTS_EXPORT',
  // Awaiting its feature: a QR code page, not yet specified.
  'QR_CODE_GENERATION',
] as const

export type Permission = (typeof PERMISSIONS)[number]
