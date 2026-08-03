// Pure HTML builders for outgoing system emails. Inline styles only —
// email clients ignore Tailwind, so the salt palette is repeated here by hand.
const NAVY = '#0d2137'
const TEXT = '#1c1c1a'
const TEXT_SEC = '#6b6b68'
const TEXT_MUTED = '#9e9e9b'
const BORDER = '#e2e0da'

export function buildPasswordResetEmail(name: string, resetUrl: string): string {
  return `
    <div style="font-family: Nunito, Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <p style="font-size: 20px; font-weight: 500; color: ${NAVY}; margin-bottom: 8px;">
        SALT of Akagera
      </p>
      <p style="color: ${TEXT_SEC}; font-size: 13px; margin-bottom: 32px;">
        Laundry Management System
      </p>
      <p style="color: ${TEXT};">Hi ${name},</p>
      <p style="color: ${TEXT};">
        A password reset was requested for your account.
        Use the button below to set a new password.
        This link expires in <strong>15 minutes</strong>.
      </p>
      <a href="${resetUrl}"
         style="display: inline-block; margin: 24px 0; padding: 12px 24px;
                background: ${NAVY}; color: white; border-radius: 8px;
                text-decoration: none; font-weight: 500;">
        Reset password
      </a>
      <p style="color: ${TEXT_MUTED}; font-size: 12px;">
        If you did not request this, ignore this email — your password will not change.
      </p>
      <hr style="border: 0; border-top: 0.5px solid ${BORDER}; margin: 24px 0;" />
      <p style="color: ${TEXT_MUTED}; font-size: 11px;">
        SALT of Akagera · Laundry Management System
      </p>
    </div>
  `
}
