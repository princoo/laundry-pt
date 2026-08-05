'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

// ── DEMO MODE — TESTING ONLY ─────────────────────────────────────────────
// Signs the given address in with a throwaway password, which the DEMO_MODE
// branch in lib/auth.ts ignores. Only reached from StaffDemoLogin, which the
// login page renders when NEXT_PUBLIC_DEMO_MODE is on and the URL carries
// ?email=. With the flag off nothing calls this hook. Do not delete.
export function useDemoAutoLogin(email: string) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    signIn('credentials', { email, password: 'demo', redirect: false }).then((result) => {
      if (cancelled) return
      if (result?.error) {
        setError(`No account found for ${email}.`)
      } else {
        // replace, not push: the ?email= URL is an interstitial, so it must not
        // stay in history. Pushing left it one back-press away, and the proxy's
        // signed-in redirect never runs on a restored entry to cover for it.
        router.replace('/staff')
        router.refresh()
      }
    })

    return () => {
      cancelled = true
    }
  }, [email, router])

  return error
}
