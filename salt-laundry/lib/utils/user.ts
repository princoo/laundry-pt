import type { UserFormValues } from '@/lib/validations/user.schema'

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
