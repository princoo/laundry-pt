import { fetchSoaProfile } from '@/lib/soaClient'
import { upsertFromSoa, EmailBelongsToAnotherUserError } from '@/services/soaUser.service'
import { collectPermissions, roleNames, toProvisionPayload } from '@/lib/utils/soaProfile'
import { hasPermission } from '@/lib/utils/permissions'
import { sessionExpiry } from '@/lib/utils/soaSignIn'

export interface SoaSessionUser {
  id: string
  soaId: string
  email: string
  name: string
  departmentName: string | null
  roleNames: string[]
  permissions: string[]
  expiresAt: number
}

// Turns the token SOA hands back into a laundry session: ask SOA who it
// belongs to, mirror the person locally, and carry their permissions.
//
// Every refusal is null, because the sign-in page must not report which gate
// closed — that would tell an attacker whether an account exists. The reason
// goes to the server log, which is the only place it is safe and the only
// place anyone can act on it.
export async function authorizeSoa(
  token: unknown, expiresAt: unknown
): Promise<SoaSessionUser | null> {
  const profile = await fetchSoaProfile(String(token ?? ''))
  if (!profile) return null

  if (profile.status === 'INACTIVE') {
    console.warn(`[soa] refused ${profile.id}: SOA reports the account inactive`)
    return null
  }

  const permissions = collectPermissions(profile.roles)
  // SOA checks this before redirecting back. The laundry checks it again
  // because access control it does not own is not access control. There is no
  // general "may use the laundry" permission, so this one doubles as it.
  if (!hasPermission(permissions, 'LAUNDRY_REQUEST_VIEW')) {
    console.warn(
      `[soa] refused ${profile.id}: no LAUNDRY_REQUEST_VIEW.`,
      `roles=[${roleNames(profile.roles).join(', ')}]`,
      `permissions=[${permissions.join(', ')}]`
    )
    return null
  }

  // The laundry session may not outlive SOA's token, so an expiry it cannot
  // read is a refusal rather than a default — the parameter arrives in a URL
  // the holder can edit, and a missing one must not buy a full hour.
  const expiry = sessionExpiry(expiresAt)
  if (expiry === null) {
    console.warn(`[soa] refused ${profile.id}: missing or already-past expiresAt`)
    return null
  }

  try {
    const { user } = await upsertFromSoa(toProvisionPayload(profile))
    return {
      id: user.id,
      soaId: user.soaId,
      email: user.email,
      name: user.name ?? '',
      departmentName: user.departmentName,
      roleNames: roleNames(profile.roles),
      permissions,
      expiresAt: expiry,
    }
  } catch (error) {
    const why = error instanceof EmailBelongsToAnotherUserError
      ? 'their email is already on a different soaId in the laundry'
      : (error as Error)?.message
    console.error(`[soa] could not mirror ${profile.id}: ${why}`)
    return null
  }
}
