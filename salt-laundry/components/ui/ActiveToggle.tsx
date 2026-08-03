'use client'

interface Props {
  checked: boolean
  onChange: () => void
  offColorClass?: string
  disabled?: boolean
}

export function ActiveToggle({ checked, onChange, offColorClass = 'bg-salt-border', disabled = false }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`w-10 h-5 rounded-full relative transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        checked ? 'bg-salt-green' : offColorClass
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
