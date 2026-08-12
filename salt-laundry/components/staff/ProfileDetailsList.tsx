import { SectionCard } from '@/components/ui/SectionCard'
import type { OwnProfile } from '@/lib/types/staffUser'

interface Props {
  profile: OwnProfile
  manageUrl: string
}

export function ProfileDetailsList({ profile, manageUrl }: Props) {
  const rows: [string, string | null][] = [
    ['Full name', profile.name],
    ['Email address', profile.email],
    ['Phone number', profile.phoneNumber],
    ['Staff number', profile.staffId],
    ['Department', profile.departmentName],
  ]

  return (
    <SectionCard
      title="Personal details"
      description="Held in SOA. Changes made there reach the laundry on your next sign-in."
    >
      <dl className="flex flex-col gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-sm text-salt-text-muted sm:w-40 sm:shrink-0">{label}</dt>
            <dd className="text-sm text-salt-text break-words">{value || 'Not set'}</dd>
          </div>
        ))}
      </dl>

      {manageUrl && (
        <a
          href={manageUrl}
          className="inline-block mt-5 text-sm text-salt-green hover:underline"
        >
          Manage these in SOA
        </a>
      )}
    </SectionCard>
  )
}
