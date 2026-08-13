import { Flag } from "lucide-react";

// Marks a request that has been returned for changes, wherever it appears in a
// queue- so a flagged request is identifiable at a glance, not only when the
// flag filter is on.
export function FlagBadge() {
  return (
    <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
      <Flag className="w-3 h-3" /> Flagged
    </span>
  );
}
