import { RoleBadge } from '@/components/admin/RoleBadge'
import { getInitials } from '@/lib/utils/user'
import type { OwnProfile } from '@/lib/hooks/useProfile'

interface Props {
  profile: OwnProfile
}

// Identity anchor for the profile page: who this account belongs to, kept out
// of the editable forms below.
export function ProfileHeaderCard({ profile }: Props) {
  return (
    <section className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-12 h-12 shrink-0 rounded-full bg-salt-navy text-white flex items-center justify-center text-base font-medium">
        {getInitials(profile.name, profile.email)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-base font-medium text-salt-text truncate">
          {profile.name?.trim() || 'No name set'}
        </p>
        <p className="text-sm text-salt-text-sec break-words">{profile.email}</p>
      </div>

      <div className="shrink-0">
        <RoleBadge role={profile.role} />
      </div>
    </section>
  )
}
