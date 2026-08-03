import type { Metadata } from 'next'
import { ForgotPasswordScreen } from '@/components/staff/ForgotPasswordScreen'

export const metadata: Metadata = { title: 'Forgot password' }

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />
}
