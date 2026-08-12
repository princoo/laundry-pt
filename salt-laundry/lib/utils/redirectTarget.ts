import { SIGNED_IN_HOME } from "@/lib/constants/soa";

// Only a path with a single leading slash is a safe place to send someone
// after sign-in. `//evil.example` and `/\evil.example` are both protocol
// relative- a browser reads them as absolute- and anything with a scheme is
// absolute outright. Without this check /authenticate is an open redirect:
// anyone could hand a member of staff a laundry link that lands on their own
// site, mid sign-in, when the user is at their least suspicious.
export function safeRedirectTarget(value: string | null | undefined): string {
  if (!value || !value.startsWith("/")) return SIGNED_IN_HOME;
  if (value.startsWith("//") || value.startsWith("/\\")) return SIGNED_IN_HOME;
  return value;
}
