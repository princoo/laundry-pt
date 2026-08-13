"use client";

import { useEffect, useState } from "react";
import { renderQrPng } from "@/lib/utils/qrImage";
import { QR_PNG_SIZE } from "@/lib/constants/qrCode";

export function useRoomQrCode(url: string | null) {
  const [entry, setEntry] = useState<{ url: string; png: string } | null>(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    renderQrPng(url, QR_PNG_SIZE)
      .then((png) => {
        if (!cancelled) setEntry({ url, png });
      })
      .catch(() => {
        /* leave the placeholder in place */
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const pngUrl = entry && entry.url === url ? entry.png : null;
  return { pngUrl, ready: !!pngUrl };
}

// Bulk sheet: a fixed code that never changes after mount. One per card.
export function useStaticQrCode(url: string, renderSize: number) {
  const [pngUrl, setPngUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    renderQrPng(url, renderSize)
      .then((png) => {
        if (!cancelled) setPngUrl(png);
      })
      .catch(() => {
        /* leave the placeholder in place */
      });
    return () => {
      cancelled = true;
    };
  }, [url, renderSize]);

  return pngUrl;
}
