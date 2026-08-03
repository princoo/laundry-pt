import type { ServiceType } from '@prisma/client'
import { getReturnDeadline } from '@/lib/utils/sla'

// "7:00 p.m." — matches the wording used in SERVICE_TYPE_DESCRIPTIONS.
export function getReturnCutoffLabel(serviceType: ServiceType, isExpress = false): string {
  const deadline = getReturnDeadline(serviceType, isExpress)
  const hours = deadline.getHours()
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  const minutes = String(deadline.getMinutes()).padStart(2, '0')
  return `${hour12}:${minutes} ${hours < 12 ? 'a.m.' : 'p.m.'}`
}

// True once today's return time for this service has passed — getReturnDeadline
// has rolled to tomorrow, so anything submitted now goes back the next day.
export function isNextDayReturn(serviceType: ServiceType, isExpress = false): boolean {
  const deadline = getReturnDeadline(serviceType, isExpress)
  return deadline.toDateString() !== new Date().toDateString()
}
