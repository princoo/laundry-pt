import { getInitials } from '@/lib/utils/user'

interface Props {
  name: string | null
  email: string
  size?: 'sm' | 'md'
}

export function UserAvatar({ name, email, size = 'sm' }: Props) {
  const box = size === 'md' ? 'w-9 h-9' : 'w-8 h-8'
  return (
    <div
      className={`${box} shrink-0 rounded-full bg-salt-green-light text-salt-green text-xs font-medium flex items-center justify-center`}
    >
      {getInitials(name, email)}
    </div>
  )
}
