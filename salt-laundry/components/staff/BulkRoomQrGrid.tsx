"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { BulkRoomQrCard } from "@/components/staff/BulkRoomQrCard";
import { ROOM_RANGES, roomsInRange, rangeLabel } from "@/lib/constants/rooms";
import { buildGuestRoomUrl } from "@/lib/utils/roomParam";

export function BulkRoomQrGrid() {
  // Which ranges are included, by index into ROOM_RANGES. All on by default.
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(ROOM_RANGES.map((_, i) => i)),
  );

  function toggle(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  const activeRanges = ROOM_RANGES.map((range, i) => ({ range, i })).filter(
    ({ i }) => selected.has(i),
  );
  const totalRooms = activeRanges.reduce(
    (sum, { range }) => sum + roomsInRange(range).length,
    0,
  );

  return (
    <div>
      {/* Controls- never printed. */}
      <div className="print:hidden mb-6 bg-white border border-[0.5px] border-salt-border rounded-xl shadow-sm p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-salt-text-muted">
              Room ranges
            </p>
            <p className="text-sm text-salt-text-sec mt-1.5">
              {totalRooms} {totalRooms === 1 ? "card" : "cards"} selected.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={totalRooms === 0}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium bg-salt-navy hover:bg-salt-navy-hover text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4" />
            Print sheet
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {ROOM_RANGES.map((range, i) => {
            const on = selected.has(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={on}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors ${
                  on
                    ? "bg-salt-navy text-white border-salt-navy"
                    : "bg-white text-salt-text-sec border-salt-border hover:bg-salt-cream"
                }`}
              >
                {rangeLabel(range)}
                <span className={on ? "text-white/70" : "text-salt-text-muted"}>
                  {" · "}
                  {roomsInRange(range).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {totalRooms === 0 ? (
        <p className="print:hidden text-sm text-salt-text-muted py-10 text-center">
          Select at least one room range to print.
        </p>
      ) : (
        <div className="space-y-8 print:space-y-0">
          {activeRanges.map(({ range, i }) => (
            <section key={i} className="break-inside-avoid print:break-inside-auto">
              {/* Screen-only range heading- in print each card is its own page,
                  self-labelled with the room, so no grouping header is needed. */}
              <h3 className="print:hidden text-[11px] uppercase tracking-wide text-salt-text-muted mb-3">
                Rooms {rangeLabel(range)}
              </h3>
              {/* Grid on screen, a plain stack in print so each card paginates
                  reliably as its own block. */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 print:block print:gap-0">
                {roomsInRange(range).map((room) => (
                  <BulkRoomQrCard
                    key={room}
                    room={room}
                    url={buildGuestRoomUrl(room)!}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
