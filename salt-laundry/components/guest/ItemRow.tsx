import type { ServiceType } from "@prisma/client";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatCurrency } from "@/lib/utils/formatting";
import { SERVICE_TYPE_LABELS } from "@/lib/constants/services";
import {
  getUnitPrice,
  initialServiceFor,
  itemQuantity,
  lineQuantity,
  serviceAvailabilityNote,
  supportsService,
} from "@/lib/utils/selections";
import type { LaundryItemOption, Selections } from "@/lib/types/guestOrder";

interface Props {
  item: LaundryItemOption;
  selections: Selections;
  defaultServiceType: ServiceType;
  onAdd: () => void;
  onLineQuantityChange: (serviceType: ServiceType, quantity: number) => void;
}

// One catalogue item, in one of two states.
//
// Untouched, it is a single price and a single stepper: the common case is one
// service for the whole order, and asking every guest to pick a service per
// garment before they can order anything would be worse for all of them.
//
// Once it's in the order the row opens into one stepper per service the item is
// priced for, each with its own price. That is what makes "two shirts washed,
// one pressed" expressible- the two counts are separate lines, not one
// quantity that has to choose. It also discloses itself at the only moment it
// matters: the guest sees the second service sitting at 0 the instant they add
// the first one, without having to know the feature exists.
export function ItemRow({
  item,
  selections,
  defaultServiceType,
  onAdd,
  onLineQuantityChange,
}: Props) {
  const total = itemQuantity(selections, item);
  const isSelected = total > 0;

  // The service an untouched row counts under, and prices at.
  const enteringService = initialServiceFor(item, defaultServiceType);

  // Named only when the item can't take the default- otherwise the price would
  // read as belonging to a service this item doesn't actually offer.
  const showService = !isSelected && !supportsService(item, defaultServiceType);

  return (
    // One grid for the whole row, so the price rail and the control column sit on
    // the same two vertical lines in every row and on both of a row's own lines.
    // The rails are fixed rather than content-sized: `auto` would let each row
    // pick its own column widths and the list would stop lining up. The control
    // column is exactly the stepper's width, so an opened row's per-service
    // steppers stay flush with every collapsed row's.
    <div
      className={`grid grid-cols-[minmax(0,1fr)_4.5rem_7.5rem] sm:grid-cols-[minmax(0,1fr)_7rem_7.5rem]
        items-center gap-x-3 gap-y-2 px-3 py-2.5 ${isSelected ? "bg-salt-cream" : ""}`}
    >
      {/* Opened, the name owns its own line and the services list beneath it;
          collapsed, it shares the line with the price and stepper. */}
      <div className={`min-w-0 ${isSelected ? "col-span-3" : ""}`}>
        <p className="text-sm font-medium text-salt-text">{item.nameEn}</p>
        {/* The service constraint rides on the translation line instead of a line
            of its own- it's a property of the item, and it costs no height. */}
        <p className="text-xs text-salt-text-muted truncate">
          {item.nameFr}
          {showService &&
            ` · ${serviceAvailabilityNote(item, defaultServiceType)}`}
        </p>
      </div>

      {isSelected ? (
        // Every service the item offers, not only the ones already counted: a
        // service sitting at 0 is the invitation to split, and hiding it would
        // leave the guest with nothing to press.
        item.services.map((service) => (
          <div key={service.type} className="contents">
            <p className="text-xs text-salt-text-sec truncate">
              {SERVICE_TYPE_LABELS[service.type]}
            </p>
            <p className="text-xs text-salt-text-sec text-right tabular-nums">
              {formatCurrency(service.price)}
              <span className="hidden sm:inline"> each</span>
            </p>
            <div className="justify-self-end">
              <QuantityStepper
                value={lineQuantity(selections, item.id, service.type)}
                onChange={(quantity) =>
                  onLineQuantityChange(service.type, quantity)
                }
                label={`${item.nameEn}, ${SERVICE_TYPE_LABELS[service.type]}`}
              />
            </div>
          </div>
        ))
      ) : (
        <>
          <p className="text-xs text-salt-text-sec text-right tabular-nums">
            {formatCurrency(getUnitPrice(item, enteringService))}
            <span className="hidden sm:inline"> each</span>
          </p>
          <div className="justify-self-end">
            {/* Nothing to take away yet, so this stepper only ever adds- and it
                adds on the service the row is priced at. */}
            <QuantityStepper value={0} onChange={onAdd} label={item.nameEn} />
          </div>
        </>
      )}
    </div>
  );
}
