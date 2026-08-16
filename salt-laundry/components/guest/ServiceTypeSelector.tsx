import type { ServiceType } from '@prisma/client'
import { SERVICE_TYPE_LABELS, SERVICE_TYPE_DESCRIPTIONS } from '@/lib/constants/services'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

interface Props {
  serviceType: ServiceType
  // Only services at least one catalogue item is priced for- a service nothing
  // can be ordered under (today: dry-cleaning) would be a dead end that greys
  // out the whole list. Pricing an item for it in the admin UI brings the
  // option back on its own.
  availableTypes: readonly ServiceType[]
  isLoading: boolean
  onChange: (serviceType: ServiceType) => void
}

// Radio, not checkbox: exactly one default is always in effect. Each option
// carries its own description so the guest compares them side by side instead
// of having to select one to find out what it means.
export function ServiceTypeSelector({
  serviceType,
  availableTypes,
  isLoading,
  onChange,
}: Props) {
  // No catalogue, no services to choose between: the item list is already
  // showing why (fetch error, or an empty catalogue), so add nothing to it.
  if (!isLoading && availableTypes.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5">
      <p className="text-[11px] uppercase tracking-wide text-salt-text-muted font-medium">
        Default service
      </p>
      <p className="text-xs text-salt-text-muted mb-3">
        Sets the service for every item in your order. You can still change
        individual items below.
      </p>

      {isLoading ? (
        // The options come from the catalogue, so they load with it- guessing
        // at all three here would flash an option the data then takes away.
        <LoadingSkeleton rows={2} />
      ) : (
        <div className="flex flex-col gap-2">
          {availableTypes.map((type) => {
            const isActive = type === serviceType
            return (
              <label
                key={type}
                className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 cursor-pointer border border-[0.5px] transition-colors ${
                  isActive ? 'border-salt-navy bg-salt-cream' : 'border-salt-border bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="defaultService"
                  checked={isActive}
                  onChange={() => onChange(type)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-salt-navy"
                />
                <span>
                  <span className="block text-sm font-medium text-salt-text">
                    {SERVICE_TYPE_LABELS[type]}
                  </span>
                  <span className="block text-xs text-salt-text-sec mt-0.5">
                    {SERVICE_TYPE_DESCRIPTIONS[type]}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
