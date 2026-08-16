import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatting";
import type { LaundryItemOption } from "@/lib/types/guestOrder";

export const OPTION_ID_PREFIX = "item-search-option-";

interface Props {
  item: LaundryItemOption;
  unitPrice: number;
  inOrder: number;
  isHighlighted: boolean;
  // Set when the current service can't take this item. The option stays in the
  // list- a search that silently dropped it would read as "we don't have it"-
  // but it can't be picked, and `note` says what the item is available for.
  disabled?: boolean;
  note?: string;
  onHighlight: () => void;
  onPick: () => void;
}

export function ItemSearchOption({
  item,
  unitPrice,
  inOrder,
  isHighlighted,
  disabled = false,
  note,
  onHighlight,
  onPick,
}: Props) {
  return (
    <button
      type="button"
      role="option"
      id={`${OPTION_ID_PREFIX}${item.id}`}
      aria-selected={isHighlighted}
      aria-disabled={disabled}
      disabled={disabled}
      onMouseEnter={disabled ? undefined : onHighlight}
      onClick={disabled ? undefined : onPick}
      className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-left transition-colors ${
        isHighlighted && !disabled ? "bg-salt-cream" : ""
      } ${disabled ? "cursor-not-allowed" : ""}`}
    >
      <span className="min-w-0">
        <span
          className={`block text-sm truncate ${
            disabled ? "text-salt-text-muted" : "text-salt-text"
          }`}
        >
          {item.nameEn}
        </span>
        <span className="block text-xs text-salt-text-muted truncate">
          {item.nameFr}
          {disabled && note && ` · ${note}`}
        </span>
      </span>

      <span className="flex items-center gap-2 shrink-0">
        {/* Already in the order- so a second Enter reads as "one more", not a
            mistake the guest has to go and check. */}
        {inOrder > 0 && (
          <span className="text-[11px] text-salt-navy font-medium">
            ×{inOrder}
          </span>
        )}
        {/* Same rule as the list rows: no price and no plus on an option the
            current service can't take- both would promise an add that won't
            happen. */}
        <span className="text-xs text-salt-text-sec whitespace-nowrap">
          {disabled ? "—" : formatCurrency(unitPrice)}
        </span>
        {!disabled && <Plus className="w-4 h-4 text-salt-green" />}
      </span>
    </button>
  );
}
