// The stages of the staff password recovery flow, shown as a progress rail on
// /staff/forgot-password and /staff/reset-password.
export const PASSWORD_RECOVERY_STEPS = [
  'Request a reset link',
  'Open the link in your email',
  'Choose a new password',
] as const
