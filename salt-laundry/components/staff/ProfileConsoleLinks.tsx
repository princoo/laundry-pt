import { ShieldCheck, Users } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";
import { SECONDARY_BUTTON_CLASSES } from "@/lib/constants/formStyles";

interface Props {
  // The Netiiv Account console, for everyone. Empty when Keycloak is not
  // configured- then the card says so rather than offering a dead link.
  accountUrl: string;
  // The realm's admin console, only for USER_ADMIN holders (null otherwise).
  adminUrl: string | null;
  // This deployment's Keycloak client, named in the review instructions.
  clientId: string;
}

// The two Keycloak consoles, reached from the profile page the same way the
// other Netiiv applications offer them. Plain anchors in the same tab: both
// consoles link back to the application.
export function ProfileConsoleLinks({ accountUrl, adminUrl, clientId }: Props) {
  return (
    <SectionCard
      title="Your Netiiv Account"
      description="Names, phone number, password, sign-in methods and active sessions are managed in the account console. One account signs you in to every Netiiv application."
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {accountUrl ? (
          <a
            href={accountUrl}
            className={`${SECONDARY_BUTTON_CLASSES} inline-flex items-center justify-center gap-2`}
          >
            <ShieldCheck className="w-4 h-4" />
            Manage account
          </a>
        ) : (
          <p className="text-sm text-salt-text-muted">
            The account console address is not configured on this server.
          </p>
        )}
        {adminUrl && (
          <a
            href={adminUrl}
            className={`${SECONDARY_BUTTON_CLASSES} inline-flex items-center justify-center gap-2`}
          >
            <Users className="w-4 h-4" />
            Admin console
          </a>
        )}
      </div>
      {adminUrl && (
        <p className="text-xs text-salt-text-muted mt-3 leading-relaxed">
          You review new registrations there: Groups, {clientId},
          pending-review, then assign one laundry role and move the person to{" "}
          {clientId}.
        </p>
      )}
    </SectionCard>
  );
}
