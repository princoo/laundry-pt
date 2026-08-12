import type { ServiceType } from '@prisma/client'
import { getReturnDeadline } from '@/lib/utils/sla'
import { hotelParts, isSameHotelDay } from '@/lib/utils/hotelTime'

// "7:00 p.m." — matches the wording used in SERVICE_TYPE_DESCRIPTIONS.
export function getReturnCutoffLabel(
  serviceTypes: readonly ServiceType[],
  isExpress = false
): string {
  // Read in hotel time: the guest is standing in the hotel, so the cutoff they
  // are shown must be the hotel's clock and not their phone's, which may be set
  // to wherever they flew in from.
  const { hour, minute } = hotelParts(getReturnDeadline(serviceTypes, isExpress))
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'a.m.' : 'p.m.'}`
}

// True once today's return time for these services has passed — getReturnDeadline
// has rolled to tomorrow, so anything submitted now goes back the next day.
export function isNextDayReturn(
  serviceTypes: readonly ServiceType[],
  isExpress = false
): boolean {
  const deadline = getReturnDeadline(serviceTypes, isExpress)
  return !isSameHotelDay(deadline, new Date())
}
