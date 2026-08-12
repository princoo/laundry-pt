import type { SoaProfile } from "@/lib/validations/soaProfile.schema";
import type { SoaUserInput } from "@/lib/validations/soaUser.schema";

// Permissions hang off roles in SOA and two roles routinely carry the same
// one, so the session gets one flat deduped list. Nothing downstream ever
// asks which role a permission came from.
export function collectPermissions(roles: SoaProfile["roles"]): string[] {
  return [...new Set(roles.flatMap((role) => role.permissions))];
}

export function roleNames(roles: SoaProfile["roles"]): string[] {
  return roles.map((role) => role.name);
}

// The mirror row keeps names only, so the profile collapses back to the same
// payload the provisioning endpoint takes- one upsert path, not two.
export function toProvisionPayload(profile: SoaProfile): SoaUserInput {
  return {
    id: profile.id,
    staffId: profile.staffId,
    email: profile.email,
    firstName: profile.firstName,
    secondName: profile.secondName,
    phoneNumber: profile.phoneNumber,
    status: profile.status,
    department: profile.department,
    roles: roleNames(profile.roles),
  };
}
