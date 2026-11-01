// Display only. Role names are the business roles of the soa.laundry client
// in Keycloak (the token carries them next to the permissions) and a user can
// hold several, so every map here is keyed by string with a default to fall
// through to- a name added in Keycloak renders, it does not break the row.
// Nothing in this file decides what anyone may do; that is
// lib/utils/permissions.ts.
export const ROLE_LABELS: Record<string, string> = {
  "Super Admin": "Super Admin",
  "Housekeeping Chief": "Housekeeping Chief",
  "Chief Front Officer": "Chief Front Officer",
  "Front Officer": "Front Officer",
  "Laundry House Keeper": "Housekeeper",
};

export const ROLE_BADGE_CLASSES: Record<string, string> = {
  "Super Admin": "bg-salt-navy text-white",
  "Housekeeping Chief": "bg-salt-green text-white",
  "Chief Front Officer": "bg-salt-green text-white",
  "Front Officer":
    "bg-salt-cream text-salt-text-sec border border-[0.5px] border-salt-border",
  "Laundry House Keeper":
    "bg-salt-cream text-salt-text-sec border border-[0.5px] border-salt-border",
};

export const DEFAULT_ROLE_BADGE_CLASS =
  "bg-salt-cream text-salt-text-sec border border-[0.5px] border-salt-border";

// Dot colour beside an author's name, so a list of notes can be scanned by role.
export const ROLE_DOT_CLASSES: Record<string, string> = {
  "Super Admin": "bg-salt-navy",
  "Housekeeping Chief": "bg-salt-green",
  "Chief Front Officer": "bg-salt-green",
  "Front Officer": "bg-salt-text-muted",
  "Laundry House Keeper": "bg-salt-text-muted",
};

export const DEFAULT_ROLE_DOT_CLASS = "bg-salt-border";
