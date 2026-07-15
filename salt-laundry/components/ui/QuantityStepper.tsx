import { Minus, Plus } from 'lucide-react'

interface Props {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantityStepper({ value, onChange, min = 0, max = 99 }: Props) {
  const isActive = value > 0

  return (
    <div className="inline-flex items-center h-8 rounded-lg border border-[0.5px] border-salt-border overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-full flex items-center justify-center bg-salt-cream text-salt-text border-r-[0.5px] border-salt-border disabled:cursor-not-allowed"
      >
        <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
      <span className="w-8 h-full flex items-center justify-center bg-white text-sm font-medium text-salt-text border-r-[0.5px] border-salt-border">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`w-8 h-full flex items-center justify-center transition-colors disabled:cursor-not-allowed ${
          isActive ? 'bg-salt-navy text-white' : 'bg-salt-cream text-salt-text'
        }`}
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
    </div>
  )
}
