import type { ServiceType } from '@prisma/client'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { ItemServiceSelect } from '@/components/guest/ItemServiceSelect'
import { formatCurrency } from '@/lib/utils/formatting'
import { SERVICE_TYPE_LABELS } from '@/lib/constants/services'
import { getUnitPrice, serviceForSelection, supportsService } from '@/lib/utils/selections'
import type { ItemSelection, LaundryItemOption } from '@/lib/types/guestOrder'

interface Props {
  item: LaundryItemOption
  selection?: ItemSelection
  defaultServiceType: ServiceType
  onQuantityChange: (quantity: number) => void
  onServiceChange: (serviceType: ServiceType) => void
}

export function ItemRow({
  item, selection, defaultServiceType, onQuantityChange, onServiceChange,
}: Props) {
  const quantity = selection?.quantity ?? 0
  const isSelected = quantity > 0

  // Pricing follows the service this row is actually on, which is what makes
  // these prices move when the default service changes.
  const rowService = serviceForSelection(item, selection, defaultServiceType)

  // Named only when the item can't take the default — otherwise the price would
  // read as belonging to a service this item doesn't actually offer.
  const showService = !isSelected && !supportsService(item, defaultServiceType)

  return (
    // One grid for the whole row, so the price rail and the control column sit on
    // the same two vertical lines in every row and on both of a row's own lines.
    // The rails are fixed rather than content-sized: `auto` would let each row
    // pick its own column widths and the list would stop lining up. The control
    // column is exactly the stepper's width, so the service picker stacked above
    // it matches on both edges.
    <div
      className={`grid grid-cols-[minmax(0,1fr)_4.5rem_7.5rem] sm:grid-cols-[minmax(0,1fr)_7rem_7.5rem]
        items-center gap-x-3 gap-y-2 px-3 py-2.5 ${isSelected ? 'bg-salt-cream' : ''}`}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-salt-text">{item.nameEn}</p>
        {/* The service constraint rides on the translation line instead of a line
            of its own — it's a property of the item, and it costs no height. */}
        <p className="text-xs text-salt-text-muted truncate">
          {item.nameFr}
          {showService && ` · ${SERVICE_TYPE_LABELS[rowService]} only`}
        </p>
      </div>

      <p className="text-xs text-salt-text-sec text-right tabular-nums">
        {formatCurrency(getUnitPrice(item, rowService))}
        <span className="hidden sm:inline"> each</span>
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
        <QuantityStepper value={quantity} onChange={onQuantityChange} label={item.nameEn} />
      </div>
    </div>
  )
}
