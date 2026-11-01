"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startSignIn } from "@/lib/actions/auth";
import { FormAlert } from "@/components/ui/FormAlert";
import {
  PRIMARY_BUTTON_CLASSES,
  SECONDARY_BUTTON_CLASSES,
} from "@/lib/constants/formStyles";
import { HOME_NAV_LINK } from "@/lib/constants/navigation";
import { REDIRECT_PARAM } from "@/lib/constants/auth";

const NOT_CONFIGURED =
  "Sign-in is not configured on this server. Ask whoever runs the laundry to set the Netiiv Account address.";
const REFUSED =
  "That sign-in could not be completed. It may have been interrupted- start again.";

interface Props {
  isConfigured: boolean;
}

// Kicks off the Keycloak round trip the moment the page mounts, and shows the
// way out when Auth.js comes back here with an error. The server action ends
// in a redirect, so on the happy path this card is on screen for a moment.
export function KeycloakSignInCard({ isConfigured }: Props) {
  const params = useSearchParams();
  const target = params.get(REDIRECT_PARAM);
  // Auth.js appends ?error=... when the callback fails.
  const [hasFailed, setHasFailed] = useState(params.has("error"));
  const [attempt, setAttempt] = useState(0);
  // One redirect per attempt. React's development double-invoke would
  // otherwise start two flows, and the second's state cookie would
  // invalidate the first's callback.
  const started = useRef(-1);

  useEffect(() => {
    if (!isConfigured || hasFailed || started.current === attempt) return;
    started.current = attempt;
    startSignIn(target).catch(() => setHasFailed(true));
  }, [isConfigured, hasFailed, attempt, target]);

  const error = !isConfigured ? NOT_CONFIGURED : hasFailed ? REFUSED : null;

  if (!error) {
    return (
      <div
        className="flex flex-col items-center text-center gap-5 py-6"
        aria-live="polite"
        aria-busy="true"
      >
        <span
          role="status"
          aria-label="Signing in"
          className="w-14 h-14 border-4 border-salt-border border-t-salt-navy rounded-full animate-spin"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-salt-text">Signing you in…</p>
          <p className="text-sm text-salt-text-sec leading-relaxed">
            Keep this page open. The Netiiv Account sign-in opens on its own.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" aria-live="polite">
      <FormAlert message={error} />
      {isConfigured && (
        <button
          type="button"
          onClick={() => {
            setHasFailed(false);
            setAttempt((n) => n + 1);
          }}
          className={PRIMARY_BUTTON_CLASSES}
        >
          Try again
        </button>
      )}
      <Link
        href={HOME_NAV_LINK.href}
        className={`${SECONDARY_BUTTON_CLASSES} text-center block`}
      >
        Back to the guest form
      </Link>
    </div>
  );
}
