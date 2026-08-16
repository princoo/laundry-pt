import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Names what is being counted, so the icon-only buttons announce themselves. */
  label?: string;
  /** Turns the whole control off- for rows that can't be changed at all. */
  disabled?: boolean;
}

// 40×32 cells. Total width is fixed, which is what lets callers line steppers up
// in a column. The visible mark is short, so each button carries a taller
// invisible hit area- the control has to survive a thumb on a phone.
const CELL = "relative w-10 h-8 flex items-center justify-center";
const HIT_AREA =
  "after:content-[''] after:absolute after:inset-x-0 after:-inset-y-1.5";

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
  disabled = false,
}: Props) {
  const isActive = value > 0;
  const suffix = label ? ` ${label}` : "";

  return (
    // No overflow clip: it would swallow the buttons' extended hit areas, so the
    // end caps carry the container's radius themselves.
    <div
      className={`inline-flex shrink-0 items-center rounded-lg border border-[0.5px] border-salt-border ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label={`Remove one${suffix}`}
        className={`${CELL} ${HIT_AREA} rounded-l-lg bg-salt-cream text-salt-text border-r-[0.5px] border-salt-border disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
      <span
        aria-live="polite"
        className={`${CELL} bg-white text-sm font-medium text-salt-text border-r-[0.5px] border-salt-border tabular-nums`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label={`Add one${suffix}`}
        className={`${CELL} ${HIT_AREA} rounded-r-lg transition-colors disabled:cursor-not-allowed ${
          isActive ? "bg-salt-navy text-white" : "bg-salt-cream text-salt-text"
        }`}
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
