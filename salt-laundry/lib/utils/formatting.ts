import { HOTEL_TIMEZONE } from '@/lib/constants/timezone'
import { hotelParts, isSameHotelDay } from '@/lib/utils/hotelTime'

export function formatCurrency(amount: number): string {
  return `RWF ${amount.toLocaleString()}`
}

// Every timestamp in this app is shown in hotel time, pinned explicitly rather
// than left to the runtime. Without it the same value renders in the server's
// zone during SSR and the device's zone after hydration — two different strings
// for one instant, and neither necessarily the hotel's.
export function formatTimestamp(date: Date | string): string {
  return new Date(date).toLocaleString('en-RW', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    timeZone: HOTEL_TIMEZONE,
  })
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`
  return formatTimestamp(date)
}

export function formatInvoiceDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: HOTEL_TIMEZONE,
  })
}

export function formatReference(seq: number, createdAt: Date | string): string {
  // The hotel's year. Built on the server, so getFullYear() would read UTC on a
  // UTC host — and a request placed at 00:30 on 1 January in Kigali would be
  // stamped with the previous year for the rest of its life.
  const { year } = hotelParts(new Date(createdAt))
  return `LDY-${year}-${String(seq).padStart(4, '0')}`
}

export function parseReference(ref: string): { seq: number } | null {
  const match = ref.trim().toUpperCase().match(/^LDY-\d{4}-(\d+)$/)
  return match ? { seq: Number(match[1]) } : null
}

export function secondsAgoLabel(date: Date, nowMs: number): string {
  const seconds = Math.floor((nowMs - date.getTime()) / 1000)
  if (seconds < 5) return 'Last updated just now'
  if (seconds < 60) return `Last updated ${seconds}s ago`
  return `Last updated ${Math.floor(seconds / 60)}m ago`
}

export function formatEventTimestamp(date: Date | string): string {
  const d = new Date(date)
  const time = d.toLocaleTimeString('en-RW', {
    hour: '2-digit', minute: '2-digit', timeZone: HOTEL_TIMEZONE,
  })
  // "Today" means the hotel's today, so an event at 00:30 Kigali still reads as
  // today to the person looking at it rather than as yesterday.
  if (isSameHotelDay(d, new Date())) return `Today, ${time}`
  const day = d.toLocaleDateString('en-RW', {
    day: 'numeric', month: 'short', timeZone: HOTEL_TIMEZONE,
  })
  return `${day}, ${time}`
}

export function summarizeItemNames(names: string[]): string {
  if (names.length <= 3) return names.join(', ')
  return `${names.slice(0, 3).join(', ')} and ${names.length - 3} more`
}

export function offShiftConfirmMessage(name: string | null, activeTaskCount: number): string {
  const who = name ?? 'This housekeeper'
  if (activeTaskCount === 0) return `${who} will stop appearing in the assignment picker.`
  const tasks = activeTaskCount === 1 ? '1 active task' : `${activeTaskCount} active tasks`
  return `${who} will stop appearing in the assignment picker. ${tasks} stay with them until you reassign them.`
}

export function getInitials(name: string | null, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    const initials = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
    return initials.toUpperCase()
  }
  return email[0]?.toUpperCase() ?? '?'
}
