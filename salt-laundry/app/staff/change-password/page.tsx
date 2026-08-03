import type { Metadata } from 'next'
import { AuthShell } from '@/components/ui/AuthShell'
import { SignedInAside } from '@/components/staff/SignedInAside'
import { ChangePasswordForm } from '@/components/staff/ChangePasswordForm'

export const metadata: Metadata = { title: 'Set your password' }

export default function ChangePasswordPage() {
  return (
    <AuthShell
      title="Set your password"
      description="Your administrator gave you a temporary password. Choose your own to finish setting up your account."
      aside={<SignedInAside />}
    >
      <ChangePasswordForm />
    </AuthShell>
  )
}
