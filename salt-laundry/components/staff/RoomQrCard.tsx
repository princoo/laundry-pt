import type { RefObject } from "react";

interface Props {
  room: string;
  url: string | null;
  containerRef: RefObject<HTMLDivElement | null>;
  // Set on the outer element so the whole card can be captured as an image.
  cardRef?: RefObject<HTMLDivElement | null>;
  // Smaller variant used on the bulk sheet; same layout, tighter sizing.
  compact?: boolean;
}

// The one card used everywhere- single generator, bulk sheet, print, and PNG
// export- so a room card looks identical however it's produced. The logo sits
// above the code; the "scan" line and room number sit below it.
export function RoomQrCard({
  room,
  url,
  containerRef,
  cardRef,
  compact = false,
}: Props) {
  const hasRoom = !!url;

  return (
    <div
      ref={cardRef}
      className={
        compact
          ? "qr-print-card break-inside-avoid bg-white flex flex-col items-center text-center rounded-xl border border-[0.5px] border-salt-border px-4 py-5 print:border-salt-text-muted"
          : "qr-print-card mx-auto w-full max-w-[340px] bg-white flex flex-col items-center text-center rounded-2xl border border-[0.5px] border-salt-border shadow-sm px-8 py-7 print:border-0 print:shadow-none"
      }
    >
      {/* Plain <img> (not next/image) so html2canvas captures it reliably. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/salt-logo.png"
        alt="Salt of Akagera"
        className={compact ? "h-8 w-auto" : "h-11 w-auto"}
      />

      <p
        className={`uppercase tracking-[0.18em] text-salt-text-muted ${
          compact ? "mt-2.5 text-[9px]" : "mt-5 text-[11px]"
        }`}
      >
        Laundry Service
      </p>

      {/* QR sits below the branding. The fixed box reserves layout while empty,
          and the container is always mounted so qr-code-styling has a stable
          node to render into. */}
      <div
        className={`relative flex items-center justify-center ${
          compact ? "mt-1 w-[150px] h-[150px]" : "mt-3 w-[260px] h-[260px]"
        }`}
      >
        <div
          ref={containerRef}
          className={hasRoom ? "" : "hidden"}
          aria-hidden={!hasRoom}
        />
        {!hasRoom && (
          <div className="w-full h-full rounded-xl border-2 border-dashed border-salt-border flex items-center justify-center px-6">
            <span className="text-sm text-salt-text-muted">
              Enter a room number to generate its code
            </span>
          </div>
        )}
      </div>
      <p
        className={`text-salt-text-sec ${compact ? "mt-0.5 text-[10px]" : "mt-1 text-sm"}`}
      >
        Scan to request laundry
      </p>
      <p
        className={`font-bold text-salt-navy leading-tight ${
          compact ? "mt-1 text-base" : "mt-3 text-2xl"
        }`}
      >
        {hasRoom ? `Room ${room}` : "Room-"}
      </p>
    </div>
  );
}
