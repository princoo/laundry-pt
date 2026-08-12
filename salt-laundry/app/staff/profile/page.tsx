import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/utils/guards";
import { getOwnProfile } from "@/services/user.service";
import { SOA_PROFILE_URL } from "@/lib/constants/soa";
import { ProfileHeaderCard } from "@/components/staff/ProfileHeaderCard";
import { ProfileDetailsList } from "@/components/staff/ProfileDetailsList";

export const metadata: Metadata = { title: "Your profile" };

// Read only, and a server component because of it- there is nothing to fetch
// on the client and nothing to submit. SOA owns every field here.
export default async function ProfilePage() {
  const current = await getCurrentUser();
  const profile = current ? await getOwnProfile(current.id) : null;

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
          <ProfileDetailsList profile={profile} manageUrl={SOA_PROFILE_URL} />
        </div>
      ) : (
        <p className="text-sm text-salt-text-sec">
          Your account could not be loaded. Sign in again, or ask SOA to check
          it.
        </p>
      )}
    </div>
  );
}
