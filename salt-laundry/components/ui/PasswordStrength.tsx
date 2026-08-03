interface Props {
  password: string
}

const LEVELS = [
  { label: 'Weak', width: 'w-1/3', color: 'bg-red-400' },
  { label: 'Ok', width: 'w-2/3', color: 'bg-amber-400' },
  { label: 'Strong', width: 'w-full', color: 'bg-salt-green' },
] as const

function levelFor(password: string) {
  if (password.length >= 14) return LEVELS[2]
  if (password.length >= 10) return LEVELS[1]
  return LEVELS[0]
}

export function PasswordStrength({ password }: Props) {
  if (!password) return null
  const level = levelFor(password)

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="h-1 flex-1 rounded-full bg-salt-border overflow-hidden">
        <div className={`h-full ${level.width} ${level.color} transition-all`} />
      </div>
      <span className="text-xs text-salt-text-sec">{level.label}</span>
    </div>
  )
}
