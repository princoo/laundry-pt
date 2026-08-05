// The stages of the staff password recovery flow, shown as a progress rail on
// /staff/forgot-password and /staff/reset-password.
export const PASSWORD_RECOVERY_STEPS = [
  'Request a reset link',
  'Open the link in your email',
  'Choose a new password',
] as const

// What the portal handles day to day. Fills the left column on /staff/login,
// where the recovery pages put their progress rail. Deliberately says nothing
// about roles or accounts — this page is reachable by anyone.
export const STAFF_PORTAL_HIGHLIGHTS = [
  { label: 'The queue', summary: 'Guest requests land here the moment they are submitted.' },
  { label: 'Every stage', summary: 'Collection, washing, ready, returned — one place, kept current.' },
  { label: 'Room billing', summary: 'Costs are tallied per room and settled at checkout.' },
] as const
