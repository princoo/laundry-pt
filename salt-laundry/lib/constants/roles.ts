// Display only. Role names arrive from SOA as free text and a user can carry
// several, so every map here is keyed by string with a default to fall
// through to — an unrecognised name renders, it does not break the row.
// Nothing in this file decides what anyone may do; that is
// lib/utils/permissions.ts.
export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  SUPERVISOR: 'Supervisor',
  HOUSEKEEPER: 'Housekeeper',
}

export const ROLE_BADGE_CLASSES: Record<string, string> = {
  ADMIN: 'bg-salt-navy text-white',
  SUPERVISOR: 'bg-salt-green text-white',
  HOUSEKEEPER: 'bg-salt-cream text-salt-text-sec border border-[0.5px] border-salt-border',
}

export const DEFAULT_ROLE_BADGE_CLASS =
  'bg-salt-cream text-salt-text-sec border border-[0.5px] border-salt-border'

// Dot colour beside an author's name, so a list of notes can be scanned by role.
export const ROLE_DOT_CLASSES: Record<string, string> = {
  ADMIN: 'bg-salt-navy',
  SUPERVISOR: 'bg-salt-green',
  HOUSEKEEPER: 'bg-salt-text-muted',
}

export const DEFAULT_ROLE_DOT_CLASS = 'bg-salt-border'
