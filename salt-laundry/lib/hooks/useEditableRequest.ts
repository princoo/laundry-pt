"use client";

import { useEffect, useState } from "react";
import { toGuestOrderDraft } from "@/lib/utils/guestDraft";
import type { GuestOrderDraft } from "@/lib/types/guestOrder";

const GENERIC_ERROR =
  "Failed to load this request. Try again or call reception.";

// Loads a request the guest is allowed to change. A 403 here isn't a failure-
// it's the request having moved on- so the message the server sends is the one
// worth showing.
export function useEditableRequest(requestId: string) {
  const [draft, setDraft] = useState<GuestOrderDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/requests/${requestId}/edit`)
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (res.ok) setDraft(toGuestOrderDraft(data.request));
        else setError(data.error ?? GENERIC_ERROR);
      })
      .catch(() => {
        if (!cancelled) setError(GENERIC_ERROR);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  return { draft, isLoading, error };
}
