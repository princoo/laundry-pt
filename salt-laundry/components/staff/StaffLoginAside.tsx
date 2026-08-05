import { STAFF_PORTAL_HIGHLIGHTS } from '@/lib/constants/authFlow'

// Left-column content for the sign-in page: what the portal covers, plus the
// answer to the one question a page with no self-signup invites.
export function StaffLoginAside() {
  return (
    <div className="flex flex-col gap-6">
      <dl className="flex flex-col gap-4">
        {STAFF_PORTAL_HIGHLIGHTS.map(({ label, summary }) => (
          <div key={label} className="grid gap-0.5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-sm font-medium text-salt-text">{label}</dt>
            <dd className="text-sm text-salt-text-sec leading-relaxed">{summary}</dd>
          </div>
        ))}
      </dl>

      <p className="text-xs text-salt-text-muted">
        No account yet? Staff accounts are created by an administrator.
      </p>
    </div>
  )
}
