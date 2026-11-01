import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/utils/guards";
import { getOwnProfile } from "@/services/user.service";
import { hasPermission } from "@/lib/utils/permissions";
import { accountConsoleUrl, adminConsoleUrl } from "@/lib/utils/keycloakUrls";
import { KEYCLOAK_CLIENT_ID } from "@/lib/constants/auth";
import { ProfileHeaderCard } from "@/components/staff/ProfileHeaderCard";
import { ProfileDetailsList } from "@/components/staff/ProfileDetailsList";
import { ProfileConsoleLinks } from "@/components/staff/ProfileConsoleLinks";

export const metadata: Metadata = { title: "Your profile" };

// Read only, and a server component because of it- there is nothing to fetch
// on the client and nothing to submit. The Netiiv Account owns every field
// here; the two consoles are reached from this page and nowhere else, as in
// the other Netiiv applications.
export default async function ProfilePage() {
  const current = await getCurrentUser();
  const profile = current?.id ? await getOwnProfile(current.id) : null;
  const canReview = hasPermission(current?.permissions, "USER_ADMIN");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-[22px] font-black text-salt-text">Your profile</h1>
        <p className="text-sm text-salt-text-sec mt-1">
          The details you sign in with.
        </p>
      </div>

      {profile ? (
        <div className="flex flex-col gap-4 sm:gap-5">
          <ProfileHeaderCard profile={profile} />
          <ProfileDetailsList profile={profile} />
          <ProfileConsoleLinks
            accountUrl={accountConsoleUrl()}
            adminUrl={canReview ? adminConsoleUrl() : null}
            clientId={KEYCLOAK_CLIENT_ID}
          />
        </div>
      ) : (
        <p className="text-sm text-salt-text-sec">
          Your account could not be loaded. Sign in again, or ask an
          administrator to check it.
        </p>
      )}
    </div>
  );
}
