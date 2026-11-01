import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Docker image copies .next/standalone: the server plus only the files
  // it was traced to need (Dockerfile, "runner").
  output: "standalone",
  // The only images are the two logos, rendered as plain <img> so the runtime
  // needs neither the optimizer nor sharp (kept out of the trace below).
  images: { unoptimized: true },
  outputFileTracingExcludes: {
    "*": ["./node_modules/.pnpm/sharp@*/**", "./node_modules/.pnpm/@img+*/**"],
  },
};

export default nextConfig;
