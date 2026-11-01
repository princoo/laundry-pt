import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/ui/AuthShell";
import { KeycloakSignInCard } from "@/components/staff/KeycloakSignInCard";
import { KEYCLOAK_ISSUER } from "@/lib/constants/auth";
import { getBrand } from "@/lib/brand";

// The landing page for anyone who needs a session: it starts the Keycloak
// sign-in on arrival and is where Auth.js reports an OAuth error, so a
// failure halfway through the round trip is recoverable here instead of
// looping. Nothing secret rides in this URL any more; it stays unindexed
// because it is a staff page.
export const metadata: Metadata = {
  title: "Signing in",
  robots: { index: false, follow: false, nocache: true },
};

export default function AuthenticatePage() {
  const { shortName } = getBrand();
  return (
    <AuthShell
      title="Signing you in"
      description={`${shortName} staff sign in with their Netiiv Account. We are sending you there and will bring you back to the laundry dashboard.`}
    >
      <Suspense fallback={null}>
        <KeycloakSignInCard isConfigured={Boolean(KEYCLOAK_ISSUER)} />
      </Suspense>
    </AuthShell>
  );
}
