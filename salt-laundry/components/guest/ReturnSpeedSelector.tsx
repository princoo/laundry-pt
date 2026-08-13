import { Clock, type LucideIcon } from "lucide-react";
import { EXPRESS_RATE_PERCENT } from "@/lib/constants/pricing";

interface Props {
  isExpress: boolean;
  onChange: (value: boolean) => void;
}

// Return speed for the whole order — a two-way choice, so it reads as a radio
// pair like the service and handling selectors rather than an opt-in checkbox.
// Normal is the default; express carries a clock so the priority option stands
// out. The underlying value is still a single isExpress boolean.
const OPTIONS: {
  express: boolean;
  label: string;
  description: string;
  icon?: LucideIcon;
}[] = [
  {
    express: false,
    label: "Normal return",
    description:
      "Collected before 10:00 a.m. and returned the same day between 4:00 and 6:00 p.m. Collected after 10:00 a.m., returned the next day.",
  },
  {
    express: true,
    label: `Express return (+${EXPRESS_RATE_PERCENT}%)`,
    description: "Collected right away and returned within 1 hour.",
    icon: Clock,
  },
];

export function ReturnSpeedSelector({ isExpress, onChange }: Props) {
  return (
    <fieldset>
      <legend className="text-[11px] uppercase tracking-wide text-salt-text-muted font-medium mb-2">
        Return time
      </legend>

      <div className="flex flex-col gap-2">
        {OPTIONS.map((option) => {
          const isActive = isExpress === option.express;
          const Icon = option.icon;
          return (
            <label
              key={option.label}
              className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 cursor-pointer border border-[0.5px] transition-colors ${
                isActive
                  ? "border-salt-navy bg-salt-cream"
                  : "border-salt-border bg-white"
              }`}
            >
              <input
                type="radio"
                name="returnSpeed"
                checked={isActive}
                onChange={() => onChange(option.express)}
                className="mt-0.5 w-4 h-4 shrink-0 accent-salt-navy"
              />
              <span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-salt-text">
                  {Icon && <Icon className="w-4 h-4 text-salt-green" />}
                  {option.label}
                </span>
                <span className="block text-xs text-salt-text-sec mt-0.5">
                  {option.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
