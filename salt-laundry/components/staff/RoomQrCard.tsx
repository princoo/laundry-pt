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

      {/* English on top, French tucked under it in a lighter, smaller line- a
          printed card in a room serves guests of both languages at once, so it
          shows both rather than following the app's language toggle. */}
      <div className={compact ? "mt-2.5" : "mt-5"}>
        <p
          className={`qr-brand-en uppercase tracking-[0.18em] text-salt-text-muted ${
            compact ? "text-[9px]" : "text-[11px]"
          }`}
        >
          Laundry Service
        </p>
        <p
          className={`qr-brand-fr uppercase tracking-[0.15em] text-salt-text-muted/70 ${
            compact ? "mt-px text-[7px]" : "mt-0.5 text-[9px]"
          }`}
        >
          Service de blanchisserie
        </p>
      </div>

      {/* QR sits below the branding. The fixed box reserves layout while empty,
          and the container is always mounted so qr-code-styling has a stable
          node to render into. */}
      <div
        className={`qr-code-box relative flex items-center justify-center ${
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
      <div className={compact ? "mt-0.5" : "mt-1"}>
        <p
          className={`qr-scan-en text-salt-text-sec ${compact ? "text-[10px]" : "text-sm"}`}
        >
          Scan to request laundry
        </p>
        <p
          className={`qr-scan-fr text-salt-text-muted ${compact ? "text-[8px]" : "text-[11px]"}`}
        >
          Scannez pour votre blanchisserie
        </p>
      </div>
      <p
        className={`qr-room font-bold text-salt-navy leading-tight ${
          compact ? "mt-1 text-base" : "mt-3 text-2xl"
        }`}
      >
        {hasRoom ? `Room / Chambre ${room}` : "Room / Chambre —"}
      </p>
    </div>
  );
}
