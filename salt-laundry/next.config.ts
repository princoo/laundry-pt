import type { NextConfig } from "next";
import { AUTHENTICATE_PATH } from "./lib/constants/soa";

const nextConfig: NextConfig = {
  // The sign-in token rides in this page's URL. no-referrer keeps it out of
  // the Referer header of anything the page goes on to request.
  async headers() {
    return [
      {
        source: AUTHENTICATE_PATH,
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
    ];
  },
};

export default nextConfig;
