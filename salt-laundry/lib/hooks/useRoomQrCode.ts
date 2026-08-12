"use client";

import { useEffect, useRef, useState } from "react";
import type QRCodeStyling from "qr-code-styling";
import { buildQrOptions } from "@/lib/utils/qrOptions";

// qr-code-styling touches `window`/`document` at construction, so it can't be
// imported at module top in a server-rendered tree. It's loaded dynamically the
// first time these hooks run on the client; the dynamic import is cached, so
// every card after the first reuses the already-parsed module.

// Single generator: one instance that repaints as the room (and so the encoded
// URL) changes, plus download handlers.
export function useRoomQrCode(url: string | null) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("qr-code-styling").then(({ default: QRCodeStylingCtor }) => {
      if (cancelled || qrRef.current) return;
      qrRef.current = new QRCodeStylingCtor(buildQrOptions(url ?? ""));
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        qrRef.current.append(containerRef.current);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
    // Runs once- `url` changes are pushed via update() below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    qrRef.current?.update({ data: url ?? "" });
  }, [url]);

  function download(extension: "png" | "svg", name: string) {
    qrRef.current?.download({ name, extension });
  }

  return { containerRef, download, ready };
}

// Bulk sheet: a fixed code that never changes after mount. One instance per card.
export function useStaticQrCode(url: string, size: number) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let qr: QRCodeStyling | null = null;
    import("qr-code-styling").then(({ default: QRCodeStylingCtor }) => {
      if (cancelled) return;
      qr = new QRCodeStylingCtor(buildQrOptions(url, size));
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        qr.append(containerRef.current);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [url, size]);

  return containerRef;
}
