import type { Permission } from "@/lib/constants/permissions";

// The one place a permission is tested. Permissions reach the session from
// the soa.laundry roles in the Keycloak access token and nothing else derives
// them- there is no role to fall
// back on. A missing or empty list fails closed.
export function hasPermission(
  permissions: readonly string[] | null | undefined,
  permission: Permission,
): boolean {
  return permissions?.includes(permission) ?? false;
}
