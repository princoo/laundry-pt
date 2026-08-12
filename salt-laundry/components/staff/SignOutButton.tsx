"use client";

import { signOut } from "next-auth/react";
import { SIGNED_IN_HOME } from "@/lib/constants/soa";

// Clears the laundry session, then walks straight back into /staff- which,
// with no session, is what hands the user to SOA. There is no laundry sign-in
// page to land on any more.
export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: SIGNED_IN_HOME })}
      className="w-full text-left text-salt-text-sec hover:text-salt-text text-sm px-3 py-1.5"
    >
      Sign out
    </button>
  );
}
