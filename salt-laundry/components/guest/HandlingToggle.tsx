"use client";

import { useFormContext } from "react-hook-form";
import type { GuestDetailsValues } from "@/lib/validations/guestRequest.schema";

// Each option carries its own description, like the service selector, so the
// guest compares the two side by side instead of picking one to find out what
// it means.
const OPTIONS = [
  {
    isHanger: true,
    label: "Shirt on hanger",
    description:
      "Returned on a hanger, ready to wear- best for shirts, dresses and suits.",
  },
  {
    isHanger: false,
    label: "Folded",
    description: "Returned folded and wrapped- easier to pack away.",
  },
];

// Its own card above the order summary: how the laundry comes back is a choice
// the guest makes about the whole order, not a line on the bill. Card classes
// sit on the wrapper rather than the fieldset- a bordered fieldset notches its
// border around the legend.
export function HandlingToggle() {
  const { watch, setValue } = useFormContext<GuestDetailsValues>();
  const isHanger = watch("isHanger");

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5">
      <fieldset>
        <legend className="text-[11px] uppercase tracking-wide text-salt-text-muted font-medium">
          Handling
        </legend>
        <p className="text-xs text-salt-text-muted mb-3">
          How your laundry comes back to your room.
        </p>

        <div className="flex flex-col gap-2">
          {OPTIONS.map((option) => {
            const isActive = isHanger === option.isHanger;
            return (
              <label
                key={option.label}
                className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 cursor-pointer border border-[0.5px] transition-colors ${
                  isActive
                    ? "border-salt-navy bg-salt-cream"
                    : "border-salt-border bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="handling"
                  checked={isActive}
                  onChange={() => setValue("isHanger", option.isHanger)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-salt-navy"
                />
                <span>
                  <span className="block text-sm font-medium text-salt-text">
                    {option.label}
                  </span>
                  <span className="block text-xs text-salt-text-sec mt-0.5">
                    {option.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
