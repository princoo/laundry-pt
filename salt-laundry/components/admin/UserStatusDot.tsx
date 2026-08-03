export function UserStatusDot({ isActive }: { isActive: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-salt-green' : 'bg-salt-text-muted'}`} />
      <span className={isActive ? 'text-salt-green' : 'text-salt-text-muted'}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </span>
  )
}
