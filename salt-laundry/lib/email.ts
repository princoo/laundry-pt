import nodemailer from 'nodemailer'
import { buildPasswordResetEmail } from '@/lib/utils/emailTemplates'

// Singleton transporter — reused across requests.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    // App Password from Google account security settings — NOT the account password.
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendPasswordResetEmail(params: {
  to: string
  name: string
  resetToken: string
}): Promise<void> {
  const resetUrl = `${process.env.APP_URL}/staff/reset-password?token=${params.resetToken}`

  await transporter.sendMail({
    from: `SALT Laundry System <${process.env.GMAIL_USER}>`,
    to: params.to,
    subject: 'Reset your SALT Laundry System password',
    html: buildPasswordResetEmail(params.name, resetUrl),
  })
}
