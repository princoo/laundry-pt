import type { Role } from '@prisma/client'

// See the note in lib/constants/services.ts on why this is a literal tuple.
export const ROLES = ['ADMIN', 'SUPERVISOR', 'HOUSEKEEPER'] as const satisfies readonly Role[]
