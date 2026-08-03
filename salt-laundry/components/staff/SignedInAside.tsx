'use client'

import { useSession, signOut } from 'next-auth/react'

// Escape hatch for the forced change-password gate: shows who is signed in and
// lets the wrong person get out.
export function SignedInAside() {
  const { data: session } = useSession()
  const email = session?.user?.email

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-salt-text-muted leading-relaxed">
        You go straight to your dashboard once it is saved.
      </p>
      {email && (
        <p className="text-[13px] text-salt-text-muted">
          Signed in as <span className="text-salt-text-sec break-words">{email}</span>.{' '}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/staff/login' })}
            className="text-salt-navy hover:text-salt-navy-hover underline underline-offset-2 transition-colors"
          >
            Sign out
          </button>
        </p>
      )}
    </div>
  )
}
