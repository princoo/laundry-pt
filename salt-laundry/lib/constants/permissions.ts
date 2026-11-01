// The permission strings the laundry checks, which are also, character for
// character, the permission roles on the soa.laundry client in the netiiv
// Keycloak realm (netiiv/admin/keycloak, import/netiiv-realm.json). A
// business role a reviewer assigns there (Housekeeping Chief, Front
// Officer, ...) is a composite of these, and the token arrives with the
// composite already expanded.
//
// The naming is inconsistent- LAUNDRY_REQUEST_VIEW is singular while
// LAUNDRY_REQUESTS_SEARCH is plural, and QR_CODE_GENERATION carries no prefix
// because the name was shared with other SOA sub-systems. Do not normalise
// them. A "corrected" string simply never matches, which fails closed and is
// very hard to spot. Adding one is a two-place change: here, and a client role
// in Keycloak plus the composites that should include it.
//
// One of these gates a feature that does not exist yet- marked below. That is
// deliberate, not a mistake. See docs/keycloak-migration.md.
export const PERMISSIONS = [
  "LAUNDRY_REQUEST_VIEW",
  "LAUNDRY_REQUESTS_VIEW_ALL",
  "LAUNDRY_REQUESTS_INVOICES_VIEW",
  "LAUNDRY_REQUESTS_INVOICES_PRINT",
  "LAUNDRY_REQUESTS_SEARCH",
  "LAUNDRY_REQUEST_PROCESS",
  // Staff correcting a request that has been flagged for changes:
  // /api/staff/requests/[id]/edit, and clearing the flag. This is NOT
  // /api/requests/[id]/edit, which is the public guest flow- do not gate that
  // route with it. Raising the flag is LAUNDRY_REQUEST_PROCESS, since the
  // person who collects the bag is the one who spots the mismatch.
  "LAUNDRY_REQUEST_EDIT",
  "LAUNDRY_REQUEST_HOUSEKEEPER_ASSIGN",
  "LAUNDRY_REQUEST_ITEMS_CATALOGUE_VIEW",
  "LAUNDRY_REQUEST_ITEMS_CATALOGUE_MANAGE",
  "LAUNDRY_HOUSEKEEPERS_VIEW",
  "LAUNDRY_HOUSEKEEPERS_SHIFTS_MANAGE",
  "LAUNDRY_REPORTS_VIEW",
  // Awaiting its feature: PDF export on the reports page.
  "LAUNDRY_REPORTS_EXPORT",
  // /staff/qrcode- printable room QR codes.
  "QR_CODE_GENERATION",
  // Delegated user administration: reviewing registrations and assigning
  // this client's roles in the Netiiv Account admin console. Every Netiiv
  // client carries it under this name. It gates one link on the profile
  // page and nothing else- the console enforces its own permissions.
  "USER_ADMIN",
] as const;

export type Permission = (typeof PERMISSIONS)[number];
