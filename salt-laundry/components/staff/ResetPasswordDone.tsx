import Link from 'next/link'
import { AuthNotice } from '@/components/ui/AuthNotice'
import { PRIMARY_BUTTON_CLASSES } from '@/lib/constants/formStyles'

export function ResetPasswordDone() {
  return (
    <AuthNotice title="Ready to sign in" body="Use your new password from now on.">
      <Link href="/staff/login" className={`${PRIMARY_BUTTON_CLASSES} block text-center`}>
        Sign in
      </Link>
    </AuthNotice>
  )
}
