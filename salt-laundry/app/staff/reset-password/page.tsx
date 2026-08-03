import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell } from '@/components/ui/AuthShell'
import { AuthNotice } from '@/components/ui/AuthNotice'
import { ResetPasswordScreen } from '@/components/staff/ResetPasswordScreen'
import { PRIMARY_BUTTON_CLASSES } from '@/lib/constants/formStyles'

export const metadata: Metadata = { title: 'Reset password' }

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <AuthShell
        title="This link is not valid"
        description="Reset links stop working 15 minutes after they are sent, and they break if an email app splits them across two lines."
      >
        <AuthNotice
          tone="neutral"
          title="Request a new one"
          body="We will email a fresh link straight away."
        >
          <Link
            href="/staff/forgot-password"
            className={`${PRIMARY_BUTTON_CLASSES} block text-center`}
          >
            Send me a link
          </Link>
        </AuthNotice>
      </AuthShell>
    )
  }

  return <ResetPasswordScreen token={token} />
}
