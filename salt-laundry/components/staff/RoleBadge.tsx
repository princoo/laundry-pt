interface Props {
  role: string
}

const ROLE_CLASSES: Record<string, string> = {
  ADMIN: 'bg-salt-navy text-white',
  SUPERVISOR: 'bg-salt-green text-white',
  HOUSEKEEPER: 'bg-salt-cream text-salt-text-sec border border-[0.5px] border-salt-border',
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  SUPERVISOR: 'Supervisor',
  HOUSEKEEPER: 'Housekeeper',
}

export function RoleBadge({ role }: Props) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${ROLE_CLASSES[role] ?? ''}`}>
      {ROLE_LABELS[role] ?? role}
    </span>
  )
}
