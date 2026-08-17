"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import type { RequestFormMode, Selections } from "@/lib/types/guestOrder";

interface SaveInput {
  roomNumber: string;
  guestName?: string;
  note?: string;
  isHanger: boolean;
  isExpress: boolean;
  selections: Selections;
  reason?: string; // staff corrections only
}

const GENERIC_ERROR = "Something went wrong. Try again or call reception.";

// The form's lines are already the payload's shape- one item under one service,
// so a split item sends two lines. isExpress stays request-level.
function toItems(selections: Selections) {
  return Object.values(selections)
    .filter((line) => line.quantity > 0)
    .map(({ laundryItemId, serviceType, quantity }) => ({
      laundryItemId,
      serviceType,
      quantity,
    }));
}

// One save path for all three modes. The payloads are identical apart from the
// room, which only a new request carries- no edit can change it.
//
// The staff correction differs in three places and no more: it PATCHes the
// staff route, it goes through apiFetch so a lapsed SOA session redirects to
// sign-in rather than looking like a save failure, and it lands back on the
// staff detail page where the authoritative total is shown.
export function useSaveRequest(mode: RequestFormMode, requestId?: string) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const isStaffEdit = mode === "staff-edit";
  const isEdit = mode === "edit" || isStaffEdit;

  const save = async (input: SaveInput) => {
    setIsSaving(true);
    setSaveError(null);
    const items = toItems(input.selections);

    const url = isStaffEdit
      ? `/api/staff/requests/${requestId}/edit`
      : isEdit
        ? `/api/requests/${requestId}/edit`
        : "/api/requests";

    try {
      const send = isStaffEdit ? apiFetch : fetch;
      const res = await send(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: input.guestName || undefined,
          note: input.note || undefined,
          isHanger: input.isHanger,
          isExpress: input.isExpress,
          items,
          ...(isEdit ? {} : { roomNumber: input.roomNumber }),
          ...(isStaffEdit && input.reason ? { reason: input.reason } : {}),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        router.push(
          isStaffEdit
            ? `/staff/requests/${requestId}`
            : isEdit
              ? `/track?${new URLSearchParams({ room: input.roomNumber, edited: "1" })}`
              : `/confirmation?${new URLSearchParams({
                  reference: data.reference,
                  room: input.roomNumber,
                  items: String(itemCount),
                })}`,
        );
        return;
      }
      // 403 carries the "already collected" message- surface it, don't mask it.
      setSaveError(
        res.status >= 500 ? GENERIC_ERROR : (data.error ?? GENERIC_ERROR),
      );
    } catch {
      setSaveError(GENERIC_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving, saveError, dismissError: () => setSaveError(null) };
}
