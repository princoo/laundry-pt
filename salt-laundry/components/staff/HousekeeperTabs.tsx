interface Props {
  tab: 'mine' | 'all'
  myCount: number
  onChange: (tab: 'mine' | 'all') => void
}

const activeClasses = 'bg-salt-navy text-white rounded-full px-4 py-1.5 text-sm'
const inactiveClasses = 'text-salt-text-sec px-4 py-1.5 text-sm hover:text-salt-text'

export function HousekeeperTabs({ tab, myCount, onChange }: Props) {
  return (
    <div className="flex gap-1 mb-4">
      <button
        type="button"
        onClick={() => onChange('mine')}
        className={tab === 'mine' ? activeClasses : inactiveClasses}
      >
        My tasks · {myCount}
      </button>
      <button
        type="button"
        onClick={() => onChange('all')}
        className={tab === 'all' ? activeClasses : inactiveClasses}
      >
        All requests
      </button>
    </div>
  )
}
