import { ActiveToggle } from "@/components/ui/ActiveToggle";
import { PermissionGate } from "@/components/ui/PermissionGate";

interface Props {
  checked: boolean;
  onChange: () => void;
  onLabel: string;
  offLabel: string;
  offColorClass?: string;
}

// The switch is gated; the label beside it is not. Someone who may only look
// at the roster still needs to read who is on shift- they just cannot change
// it. The route behind the switch carries the same gate.
export function UserFlagToggle({
  checked,
  onChange,
  onLabel,
  offLabel,
  offColorClass,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <PermissionGate permission="LAUNDRY_HOUSEKEEPERS_SHIFTS_MANAGE">
        <ActiveToggle
          checked={checked}
          onChange={onChange}
          offColorClass={offColorClass}
        />
      </PermissionGate>
      <span className="text-xs text-salt-text-sec whitespace-nowrap">
        {checked ? onLabel : offLabel}
      </span>
    </div>
  );
}
