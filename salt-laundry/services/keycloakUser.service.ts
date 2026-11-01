import { prisma } from "@/lib/prisma";
import { fullName } from "@/lib/utils/user";

// What a token says about the person signing in. Everything Keycloak owns
// arrives here; the laundry's two flags (isHousekeeper, isAvailable) never do.
export interface TokenIdentity {
  keycloakId: string;
  email: string | null;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  // Business-role names, for display. Permissions are not stored.
  roleNames: string[];
  // Holds at least one soa.laundry role. Without one the person can sign in
  // to the realm but has no business in the laundry, and no row is created.
  hasAccess: boolean;
}

const MIRROR_SELECT = {
  id: true,
  keycloakId: true,
  name: true,
  email: true,
  phoneNumber: true,
  roleNames: true,
  isHousekeeper: true,
  isActive: true,
  isAvailable: true,
} as const;

export type MirroredUser = NonNullable<
  Awaited<ReturnType<typeof upsertFromToken>>
>;

// The mirror follows the token: keyed on the Keycloak subject, refreshed on
// every sign-in and token refresh, never deleted (requests and notes point
// at it). isActive means "has access to the laundry"; a disabled Keycloak
// account cannot get a token at all, so that case never reaches here.
//
// Rows from the SOA era carry SOA's user id where the subject now goes. The
// first sign-in adopts such a row by its email- Keycloak has verified it and
// the realm forbids duplicates- so the person keeps their history instead of
// becoming a second account with the same address.
export async function upsertFromToken(identity: TokenIdentity) {
  const email = identity.email?.trim().toLowerCase() || null;
  const row = {
    firstName: identity.firstName?.trim() || null,
    secondName: identity.lastName?.trim() || null,
    name: fullName(identity.firstName, identity.lastName),
    phoneNumber: identity.phoneNumber?.trim() || null,
    roleNames: identity.roleNames,
    isActive: identity.hasAccess,
  };

  const bySubject = await prisma.user.findUnique({
    where: { keycloakId: identity.keycloakId },
    select: { id: true },
  });
  if (bySubject) {
    return prisma.user.update({
      where: { id: bySubject.id },
      data: { ...row, ...(email ? { email } : {}) },
      select: MIRROR_SELECT,
    });
  }

  // No row for this subject yet. Without an address there is nothing to
  // adopt or create under; the realm always issues one, so this is defensive.
  if (!email) return null;

  const byEmail = identity.emailVerified
    ? await prisma.user.findUnique({ where: { email }, select: { id: true } })
    : null;
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: { keycloakId: identity.keycloakId, ...row },
      select: MIRROR_SELECT,
    });
  }

  // A stranger with a Netiiv Account and no laundry role leaves no trace,
  // the same rule the eRequisition backend applies.
  if (!identity.hasAccess) return null;

  return prisma.user.create({
    data: { keycloakId: identity.keycloakId, email, ...row },
    select: MIRROR_SELECT,
  });
}
