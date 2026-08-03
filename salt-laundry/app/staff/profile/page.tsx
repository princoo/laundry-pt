'use client'

import { useProfile } from '@/lib/hooks/useProfile'
import { ProfileHeaderCard } from '@/components/staff/ProfileHeaderCard'
import { ProfileDetailsCard } from '@/components/staff/ProfileDetailsCard'
import { ProfilePasswordCard } from '@/components/staff/ProfilePasswordCard'
import { ProfileSkeleton } from '@/components/staff/ProfileSkeleton'
import { FetchError } from '@/components/ui/FetchError'

export default function ProfilePage() {
  const { profile, isLoading, error, refetch } = useProfile()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-[22px] font-black text-salt-text">Your profile</h1>
        <p className="text-sm text-salt-text-sec mt-1">
          The details you sign in with and the password that protects them.
        </p>
      </div>

      {isLoading ? (
        <ProfileSkeleton />
      ) : error || !profile ? (
        <FetchError message={error ?? 'Failed to load your profile.'} onRetry={refetch} />
      ) : (
        <div className="flex flex-col gap-4 sm:gap-5">
          <ProfileHeaderCard profile={profile} />
          <div className="grid gap-4 sm:gap-5 lg:grid-cols-2 lg:items-start">
            <ProfileDetailsCard profile={profile} onSaved={refetch} />
            <ProfilePasswordCard />
          </div>
        </div>
      )}
    </div>
  )
}
