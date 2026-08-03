import type { ServiceType } from '@prisma/client'
import { SERVICE_TYPES, SERVICE_TYPE_LABELS, SERVICE_TYPE_DESCRIPTIONS } from '@/lib/constants/services'
import { NextDayNotice } from '@/components/guest/NextDayNotice'

interface Props {
  serviceType: ServiceType
  onChange: (serviceType: ServiceType) => void
}

export function ServiceTypeSelector({ serviceType, onChange }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-5">
      <p className="text-[11px] uppercase tracking-wide text-salt-text-muted font-medium mb-3">
        Service type
      </p>
      <div className="flex gap-2 overflow-x-auto flex-nowrap -mx-1 px-1">
        {SERVICE_TYPES.map((type) => {
          const isActive = type === serviceType
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={`py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-salt-navy hover:bg-salt-navy-hover text-white'
                  : 'bg-white text-salt-text-sec border border-[0.5px] border-salt-border'
              }`}
            >
              {SERVICE_TYPE_LABELS[type]}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-sm text-salt-text-sec">
        {SERVICE_TYPE_DESCRIPTIONS[serviceType]}
      </p>

      <NextDayNotice serviceType={serviceType} />
    </div>
  )
}
