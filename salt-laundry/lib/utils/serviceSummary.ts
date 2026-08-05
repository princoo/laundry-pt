import type { ServiceType } from '@prisma/client'
import { SERVICE_TYPE_LABELS, MIXED_SERVICE_LABEL } from '@/lib/constants/services'

// A request's distinct service types, in the order they first appear.
export function uniqueServiceTypes(
  lines: readonly { serviceType: ServiceType }[]
): ServiceType[] {
  return [...new Set(lines.map((line) => line.serviceType))]
}

// One label for a whole request: the service name when every line agrees,
// "Mixed" when they don't.
export function getServiceLabel(serviceTypes: readonly ServiceType[]): string {
  if (serviceTypes.length === 0) return SERVICE_TYPE_LABELS.NORMAL
  return serviceTypes.length === 1
    ? SERVICE_TYPE_LABELS[serviceTypes[0]]
    : MIXED_SERVICE_LABEL
}
