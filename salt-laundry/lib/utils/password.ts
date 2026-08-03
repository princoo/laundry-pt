export interface PasswordCheck {
  label: string
  met: boolean
}

// Live requirement feedback for the password forms. Mirrors the zod schemas so
// the rules are visible before submitting, not after. `current` is passed by
// the forms that ask for the existing password; reset-password has no such
// field, so that row is skipped there.
export function getPasswordChecks(
  next: string,
  confirm: string,
  current?: string
): PasswordCheck[] {
  const checks: PasswordCheck[] = [
    { label: 'At least 8 characters', met: next.length >= 8 },
  ]

  if (current !== undefined) {
    checks.push({
      label: 'Different from your current password',
      met: next.length > 0 && next !== current,
    })
  }

  checks.push({
    label: 'Both new password entries match',
    met: next.length > 0 && next === confirm,
  })

  return checks
}
