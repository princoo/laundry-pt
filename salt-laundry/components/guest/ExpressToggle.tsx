import { Clock } from "lucide-react";
import { useNextDayReturn } from "@/lib/hooks/useNextDayReturn";

interface Props {
  isExpress: boolean;
  onChange: (value: boolean) => void;
}

// Request-level: express is priority return for the whole order, so the
// deadline it previews doesn't depend on any item's service.
export function ExpressToggle({ isExpress, onChange }: Props) {
  const isNextDay = useNextDayReturn([], true);

  return (
    <label
      className={`flex items-start gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
        isExpress ? "bg-salt-green-light" : "bg-salt-cream"
      }`}
    >
      <input
        type="checkbox"
        checked={isExpress}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 rounded accent-salt-navy"
      />
      <span>
        <span
          className={`flex items-center gap-1.5 text-sm font-medium ${isExpress ? "text-salt-green" : "text-salt-text"}`}
        >
          <Clock className="w-4 h-4 text-salt-green" />
          Express return (+30%)
        </span>
        <span
          className={`block text-xs mt-0.5 ${isExpress ? "text-salt-green" : "text-salt-text-muted"}`}
        >
          Priority- {isNextDay ? "next-day" : "same-day"} return by 3:00 p.m.
        </span>
      </span>
    </label>
  );
}
