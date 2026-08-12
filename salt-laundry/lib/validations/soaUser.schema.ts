import { z } from 'zod'

// SOA sends department and roles either as bare names or as full objects, and
// which one arrives depends on the call site on their side. Read the name out
// of the object form rather than asking them to normalise it — a payload that
// parses either way cannot be broken by that choice changing.
const namedRef = z.union([
  z.string().trim().min(1),
  z.object({ name: z.string().trim().min(1) }).transform((ref) => ref.name),
])

export const soaUserSchema = z.object({
  id: z.string().trim().min(1, 'id is required'),
  staffId: z.string().trim().optional(),
  email: z.email('Enter a valid email address').trim(),
  firstName: z.string().trim().optional(),
  secondName: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  department: namedRef.optional(),
  roles: z.array(namedRef).optional(),
})

export type SoaUserInput = z.infer<typeof soaUserSchema>
