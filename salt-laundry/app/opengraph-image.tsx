// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SALT of Akagera- Laundry Service";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#0d2137",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      <p
        style={{
          color: "#ffffff",
          fontSize: 96,
          fontWeight: 500,
          margin: 0,
          letterSpacing: "-2px",
        }}
      >
        salt
      </p>
      <p
        style={{
          color: "#ffffff",
          fontSize: 36,
          fontWeight: 400,
          margin: "8px 0 0",
          opacity: 0.7,
        }}
      >
        of Akagera, Rwanda
      </p>
      <p
        style={{
          color: "#6b8f2e",
          fontSize: 28,
          fontWeight: 400,
          margin: "24px 0 0",
        }}
      >
        Laundry Service
      </p>
    </div>,
    { ...size },
  );
}
