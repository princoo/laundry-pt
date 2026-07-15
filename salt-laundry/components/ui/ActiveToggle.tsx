'use client'

interface Props {
  checked: boolean
  onChange: () => void
}

export function ActiveToggle({ checked, onChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`w-10 h-5 rounded-full relative transition-colors ${
        checked ? 'bg-salt-green' : 'bg-salt-border'
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
