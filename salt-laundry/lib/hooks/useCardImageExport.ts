"use client";

import { useCallback, useState } from "react";
import type { RefObject } from "react";

export function useCardImageExport(targetRef: RefObject<HTMLElement | null>) {
  const [exporting, setExporting] = useState(false);

  const exportPng = useCallback(
    async (filename: string) => {
      const node = targetRef.current;
      if (!node) return;

      setExporting(true);
      try {
        const { domToPng } = await import("modern-screenshot");
        const dataUrl = await domToPng(node, {
          scale: 3, // sharp enough for the QR to stay scannable when printed
          backgroundColor: "#ffffff",
        });
        const link = document.createElement("a");
        link.download = filename.endsWith(".png")
          ? filename
          : `${filename}.png`;
        link.href = dataUrl;
        link.click();
      } finally {
        setExporting(false);
      }
    },
    [targetRef],
  );

  return { exportPng, exporting };
}
