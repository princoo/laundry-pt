"use client";

import { useState } from "react";
import { QrCode, LayoutGrid } from "lucide-react";
import { RoomQrGenerator } from "@/components/staff/RoomQrGenerator";
import { BulkRoomQrGrid } from "@/components/staff/BulkRoomQrGrid";

type Mode = "single" | "bulk";

const TABS: { mode: Mode; label: string; icon: typeof QrCode }[] = [
  { mode: "single", label: "Single room", icon: QrCode },
  { mode: "bulk", label: "All rooms", icon: LayoutGrid },
];

export function RoomQrWorkspace() {
  const [mode, setMode] = useState<Mode>("single");

  return (
    <div>
      {/* Segmented control- never printed. */}
      <div className="print:hidden mb-6 inline-flex rounded-lg border border-[0.5px] border-salt-border bg-white p-1">
        {TABS.map(({ mode: m, label, icon: Icon }) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-salt-navy text-white"
                : "text-salt-text-sec hover:text-salt-text"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {mode === "single" ? <RoomQrGenerator /> : <BulkRoomQrGrid />}
    </div>
  );
}
