import { SectionCard } from '@/components/ui/SectionCard'
import type { OwnProfile } from '@/lib/types/staffUser'

interface Props {
  profile: OwnProfile
}

export function ProfileDetailsList({ profile }: Props) {
  const rows: [string, string | null][] = [
    ['Full name', profile.name],
    ['Email address', profile.email],
    ['Phone number', profile.phoneNumber],
  ]

  return (
    <SectionCard
      title="Personal details"
      description="Held in your Netiiv Account. Changes made there reach the laundry on your next page load."
    >
      <dl className="flex flex-col gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-sm text-salt-text-muted sm:w-40 sm:shrink-0">{label}</dt>
            <dd className="text-sm text-salt-text break-words">{value || 'Not set'}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  )
}
