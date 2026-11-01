import { PERMISSIONS, type Permission } from "@/lib/constants/permissions";

// The claims the laundry reads from a Keycloak access token.
export interface KeycloakAccessClaims {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
  // From the realm's `phone` client scope (user-profile attribute phoneNumber).
  phone_number?: string;
  exp?: number;
  // Client roles, per client. Full scope is off on every Netiiv client, so
  // only this client's roles (plus scope-mapped realm roles) are ever here.
  resource_access?: Record<string, { roles?: string[] }>;
}

// Everything the person holds on one client. Keycloak has already expanded
// composites, so a business role arrives together with its permission roles.
export function clientRoles(
  claims: KeycloakAccessClaims | null | undefined,
  clientId: string,
): string[] {
  return claims?.resource_access?.[clientId]?.roles ?? [];
}

const PERMISSION_SET: ReadonlySet<string> = new Set(PERMISSIONS);

// One list from Keycloak, two uses here: the strings in PERMISSIONS decide
// access; everything else is a business role name (Super Admin, Front
// Officer, ...) and is display only. Same split eRequisition makes.
export function splitRoles(roles: readonly string[]): {
  permissions: Permission[];
  roleNames: string[];
} {
  const permissions: Permission[] = [];
  const roleNames: string[] = [];
  for (const role of new Set(roles)) {
    if (PERMISSION_SET.has(role)) permissions.push(role as Permission);
    else roleNames.push(role);
  }
  return { permissions, roleNames: roleNames.sort() };
}
