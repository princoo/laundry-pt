'use client'

import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/staff/login' })}
      className="w-full text-left text-salt-text-sec hover:text-salt-text text-sm px-3 py-1.5"
    >
      Sign out
    </button>
  )
}
