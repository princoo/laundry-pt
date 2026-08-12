import {
  ROLE_BADGE_CLASSES,
  ROLE_LABELS,
  DEFAULT_ROLE_BADGE_CLASS,
} from '@/lib/constants/roles'

interface Props {
  // Plain strings, not the enum — SOA role names drop straight in, and a user
  // can carry more than one. Display only; permissions decide access.
  roleNames: string[]
  shape?: 'tag' | 'pill'
}

export function RoleBadge({ roleNames, shape = 'tag' }: Props) {
  if (roleNames.length === 0) return null
  const sizing = shape === 'pill' ? 'px-2.5 py-1 rounded-full' : 'px-2 py-0.5 rounded'

  return (
    <span className="flex items-center gap-1">
      {roleNames.map((name) => (
        <span
          key={name}
          className={`text-xs whitespace-nowrap ${sizing} ${
            ROLE_BADGE_CLASSES[name] ?? DEFAULT_ROLE_BADGE_CLASS
          }`}
        >
          {ROLE_LABELS[name] ?? name}
        </span>
      ))}
    </span>
  )
}
