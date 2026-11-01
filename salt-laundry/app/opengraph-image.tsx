import { ImageResponse } from "next/og";
import { getBrand } from "@/lib/brand";

// Rendered on the Node runtime at request time, so the words come from the
// deployment's environment rather than from the build.
export const dynamic = "force-dynamic";
export const alt = "Laundry Service";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const { orgName, address } = getBrand();
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
        textAlign: "center",
      }}
    >
      <p
        style={{
          color: "#ffffff",
          fontSize: 80,
          fontWeight: 500,
          margin: 0,
          letterSpacing: "-2px",
        }}
      >
        {orgName}
      </p>
      <p
        style={{
          color: "#ffffff",
          fontSize: 34,
          fontWeight: 400,
          margin: "8px 0 0",
          opacity: 0.7,
        }}
      >
        {address}
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
