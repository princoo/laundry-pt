"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, Home } from "lucide-react";
import {
  StatusScreen,
  STATUS_PRIMARY_ACTION,
  STATUS_SECONDARY_ACTION,
} from "@/components/ui/StatusScreen";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  // The only place the real error is allowed to surface- the browser console,
  // and whatever error reporting the host wires up. Never the screen: an
  // exception message is not something a guest or a housekeeper can act on.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      title="Something went wrong"
      message="An unexpected error stopped this page from loading. Trying again usually clears it; if it keeps happening, let reception know."
    >
      <button type="button" onClick={reset} className={STATUS_PRIMARY_ACTION}>
        <RotateCw className="w-4 h-4" />
        Try again
      </button>
      <Link href="/" className={STATUS_SECONDARY_ACTION}>
        <Home className="w-4 h-4" />
        Back to home
      </Link>

      {/* A hash of the error, not its text- safe to show, and the one thing that
          lets support match a report to the logs. */}
      {error.digest && (
        <p className="basis-full text-xs text-salt-text-muted mt-2">
          Reference: {error.digest}
        </p>
      )}
    </StatusScreen>
  );
}
