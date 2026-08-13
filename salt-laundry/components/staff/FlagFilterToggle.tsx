"use client";

import { Flag } from "lucide-react";

interface Props {
  active: boolean;
  onChange: (active: boolean) => void;
}

// An independent on/off narrowing, unlike the single-select status pills- so it
// is a toggle rather than one of them, and takes the amber flag styling when on.
export function FlagFilterToggle({ active, onChange }: Props) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      aria-pressed={active}
      className={
        active
          ? "flex items-center gap-1.5 bg-amber-100 text-amber-800 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-colors"
          : "flex items-center gap-1.5 text-salt-text-sec border border-[0.5px] border-salt-border rounded-full px-4 py-1.5 text-sm whitespace-nowrap hover:text-salt-text hover:bg-salt-cream transition-colors"
      }
    >
      <Flag className="w-3.5 h-3.5" /> Flagged
    </button>
  );
}
