"use client";

import { useState } from "react";
import { QUICK_RANGES, type QuickRange } from "@/lib/utils/dateRange";

// Local rather than INPUT_CLASSES: these two sit inline in a filter row, so
// they are tighter (py-2) and not full-width. The text sizing must still match
// it- under 16px makes iOS Safari zoom the viewport on focus.
const inputClasses =
  "border border-[0.5px] border-salt-border rounded-lg px-3 py-2 text-base sm:text-sm focus:outline-none focus:border-salt-navy bg-white";

interface Props {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onGenerate: () => void;
  onQuickRange: (quick: QuickRange) => void;
  isLoading: boolean;
}

export function ReportsPeriodSelector({
  from,
  to,
  onFromChange,
  onToChange,
  onGenerate,
  onQuickRange,
  isLoading,
}: Props) {
  const [activeQuick, setActiveQuick] = useState<QuickRange | null>(
    "This month",
  );

  function handleDateChange(setter: (value: string) => void, value: string) {
    setActiveQuick(null);
    setter(value);
  }

  function handleQuickRange(quick: QuickRange) {
    setActiveQuick(quick);
    onQuickRange(quick);
  }

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="block text-xs text-salt-text-muted mb-1">
              From
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => handleDateChange(onFromChange, e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-xs text-salt-text-muted mb-1">
              To
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => handleDateChange(onToChange, e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-5 py-2 text-sm font-medium disabled:opacity-60 w-full sm:w-auto"
        >
          {isLoading ? "Generating…" : "Generate report"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-salt-border">
        {QUICK_RANGES.map((quick) => (
          <button
            key={quick}
            type="button"
            onClick={() => handleQuickRange(quick)}
            className={`text-xs rounded-full px-3 py-1.5 border border-[0.5px] transition-colors ${
              activeQuick === quick
                ? "bg-salt-navy border-salt-navy text-white"
                : "text-salt-text-sec border-salt-border hover:border-salt-navy hover:text-salt-navy"
            }`}
          >
            {quick}
          </button>
        ))}
      </div>
    </div>
  );
}
