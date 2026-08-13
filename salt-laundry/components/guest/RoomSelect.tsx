"use client";

import { useFormContext } from "react-hook-form";
import { RoomNumberInput } from "@/components/ui/RoomNumberInput";
import type { GuestDetailsValues } from "@/lib/validations/guestRequest.schema";

// The guest form's room field- a thin react-hook-form adapter over the shared
// RoomNumberInput. The combobox itself (dropdown, filtering, keyboard nav) lives
// in RoomNumberInput so the QR page and the track page share exactly this input.
export function RoomSelect() {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<GuestDetailsValues>();
  const value = watch("roomNumber") ?? "";

  return (
    <RoomNumberInput
      id="roomNumber"
      value={value}
      onChange={(room) =>
        setValue("roomNumber", room, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      onBlur={() => trigger("roomNumber")}
      invalid={!!errors.roomNumber}
      hideDropdown
    />
  );
}
