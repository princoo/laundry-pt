"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

// The catch-all for an error thrown by the root layout itself. It replaces the
// layout, so it renders its own <html>/<body> and cannot count on the app's
// stylesheet being present- everything here is inline-styled with the brand
// colours so it still looks like SALT even when nothing else has loaded.
export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          background: "#f5f4f1",
          color: "#1c1c1a",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "28rem", width: "100%", textAlign: "center" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              lineHeight: 1,
              color: "rgba(16,48,80,0.15)",
            }}
          >
            500
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, margin: "4px 0 0" }}>
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#6b6b68",
              lineHeight: 1.6,
              margin: "12px 0 0",
            }}
          >
            An unexpected error stopped the app from loading. Try again in a
            moment; if it persists, let reception know.
          </p>
          <div
            style={{
              marginTop: "28px",
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                background: "#103050",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "11px 20px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              Try again
            </button>
            {/* A plain full-page navigation on purpose: the root layout has
                crashed, so a hard reload of "/" is a surer recovery than
                client-side routing. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                background: "#ffffff",
                color: "#1c1c1a",
                border: "0.5px solid #e2e0da",
                borderRadius: "8px",
                padding: "11px 20px",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Back to home
            </a>
          </div>
          {error.digest && (
            <p style={{ fontSize: "12px", color: "#9e9e9b", marginTop: "16px" }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
