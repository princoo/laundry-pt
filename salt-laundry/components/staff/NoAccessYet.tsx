"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SignOutButton } from "@/components/staff/SignOutButton";
import { PRIMARY_BUTTON_CLASSES } from "@/lib/constants/formStyles";
import { HOME_NAV_LINK } from "@/lib/constants/navigation";

// A Netiiv Account that is signed in but holds no laundry role yet: the
// state every new registration starts in until a reviewer assigns one in the
// admin console. "Check again" asks Auth.js to refresh the token now rather
// than at its next expiry, so the newly assigned role shows without a
// sign-out. Mirrors eRequisition's no-access page.
export function NoAccessYet() {
  const { update } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  const checkAgain = async () => {
    setIsChecking(true);
    try {
      // With a body this is a POST, which is what makes Auth.js run the jwt
      // callback with trigger "update"; update() with no argument only
      // re-reads the session. The payload itself is ignored server-side.
      await update({ reason: "check-access" });
      router.refresh();
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-8 flex flex-col gap-4 text-center">
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-salt-text">No access yet</p>
          <p className="text-sm text-salt-text-sec leading-relaxed">
            You are signed in, but your Netiiv Account has no role in the
            laundry. Ask an administrator to assign one; it takes effect on
            your next page load.
          </p>
        </div>
        <button
          type="button"
          onClick={checkAgain}
          disabled={isChecking}
          className={PRIMARY_BUTTON_CLASSES}
        >
          {isChecking ? "Checking…" : "Check again"}
        </button>
        <div className="flex items-center justify-between border-t-[0.5px] border-salt-border pt-3">
          <Link
            href={HOME_NAV_LINK.href}
            className="text-salt-navy text-sm underline"
          >
            ← Back to the guest form
          </Link>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
