import type { ServiceType } from "@prisma/client";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { ItemServiceSelect } from "@/components/guest/ItemServiceSelect";
import { formatCurrency } from "@/lib/utils/formatting";
import {
  getUnitPrice,
  serviceAvailabilityNote,
  serviceForSelection,
  supportsService,
} from "@/lib/utils/selections";
import type { ItemSelection, LaundryItemOption } from "@/lib/types/guestOrder";

interface Props {
  item: LaundryItemOption;
  selection?: ItemSelection;
  defaultServiceType: ServiceType;
  onQuantityChange: (quantity: number) => void;
  onServiceChange: (serviceType: ServiceType) => void;
}

export function ItemRow({
  item,
  selection,
  defaultServiceType,
  onQuantityChange,
  onServiceChange,
}: Props) {
  const quantity = selection?.quantity ?? 0;
  const isSelected = quantity > 0;

  // An item with no price for the selected service can't be added: the row
  // stays in the list but reads as off, with a note naming the service it IS
  // priced for. Disabled rather than hidden so the list keeps its shape and
  // the guest can see what switching service would unlock. A row already in
  // the order is never off- it rode in under a service it does support, and
  // the guest must stay able to adjust or remove it.
  const isUnavailable = !isSelected && !supportsService(item, defaultServiceType);

  // Pricing follows the service this row is actually on, which is what makes
  // these prices move when the default service changes.
  const rowService = serviceForSelection(item, selection, defaultServiceType);

  return (
    // One grid for the whole row, so the price rail and the control column sit on
    // the same two vertical lines in every row and on both of a row's own lines.
    // The rails are fixed rather than content-sized: `auto` would let each row
    // pick its own column widths and the list would stop lining up. The control
    // column is exactly the stepper's width, so the service picker stacked above
    // it matches on both edges.
    <div
      className={`grid grid-cols-[minmax(0,1fr)_4.5rem_7.5rem] sm:grid-cols-[minmax(0,1fr)_7rem_7.5rem]
        items-center gap-x-3 gap-y-2 px-3 py-2.5 ${isSelected ? "bg-salt-cream" : ""}`}
    >
      <div className="min-w-0">
        {/* The name dims but the note doesn't: the note is the explanation, and
            it has to stay readable on the very row it explains. */}
        <p
          className={`text-sm font-medium ${
            isUnavailable ? "text-salt-text-muted" : "text-salt-text"
          }`}
        >
          {item.nameEn}
        </p>
        {/* The service constraint rides on the translation line instead of a line
            of its own- it's a property of the item, and it costs no height. */}
        <p className="text-xs text-salt-text-muted truncate">
          {item.nameFr}
          {isUnavailable &&
            ` · ${serviceAvailabilityNote(item, defaultServiceType)}`}
        </p>
      </div>

      {/* No price on an off row: this rail lists prices for the selected
          service, and the one service this item does offer is already named on
          the note- a number here would read as belonging to the wrong service. */}
      <p className="text-xs text-salt-text-sec text-right tabular-nums">
        {isUnavailable ? (
          "—"
        ) : (
          <>
            {formatCurrency(getUnitPrice(item, rowService))}
            <span className="hidden sm:inline"> each</span>
          </>
        )}
      </p>

      {/* Picking the row discloses its service in the control column, which pushes
          the stepper onto a second line directly beneath it. Both are pinned to
          column 3, so the two controls stack flush and the price rail is untouched. */}
      {isSelected && selection && (
        <div className="col-start-3">
          <ItemServiceSelect
            services={item.services}
            value={selection.serviceType}
            onChange={onServiceChange}
          />
        </div>
      )}

      <div className="col-start-3 justify-self-end">
        <QuantityStepper
          value={quantity}
          onChange={onQuantityChange}
          label={item.nameEn}
          disabled={isUnavailable}
        />
      </div>
    </div>
  );
}
