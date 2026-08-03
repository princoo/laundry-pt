import type { UserFormValues } from '@/lib/validations/user.schema'

// Monogram for the profile avatar. Falls back to the email for accounts an
// admin created without a name.
export function getInitials(name: string | null, email: string): string {
  const trimmed = name?.trim()
  if (!trimmed) return (email.trim()[0] ?? '?').toUpperCase()

  const words = trimmed.split(/\s+/)
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return (words[0][0] + last).toUpperCase()
}

export function buildUserPayload(values: UserFormValues) {
  if (values.isNew) {
    return {
      name: values.name,
      email: values.email,
      role: values.role,
      password: values.password,
    }
  }
  return {
    name: values.name,
    email: values.email,
    role: values.role,
    isActive: values.isActive,
  }
}
