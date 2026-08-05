import type { Role } from '@prisma/client'

// See the note in lib/constants/services.ts on why this is a literal tuple.
export const ROLES = ['ADMIN', 'SUPERVISOR', 'HOUSEKEEPER'] as const satisfies readonly Role[]

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Admin',
  SUPERVISOR: 'Supervisor',
  HOUSEKEEPER: 'Housekeeper',
}

// Dot colour beside an author's name, so a list of notes can be scanned by role.
export const ROLE_DOT_CLASSES: Record<Role, string> = {
  ADMIN: 'bg-salt-navy',
  SUPERVISOR: 'bg-salt-green',
  HOUSEKEEPER: 'bg-salt-text-muted',
}
