export function formatCurrency(amount: number): string {
  return `RWF ${amount.toLocaleString()}`
}

export function formatTimestamp(date: Date | string): string {
  return new Date(date).toLocaleString('en-RW', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`
  return formatTimestamp(date)
}

export function formatReference(seq: number, createdAt: Date | string): string {
  const year = new Date(createdAt).getFullYear()
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
  const time = d.toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' })
  const isToday = d.toDateString() === new Date().toDateString()
  if (isToday) return `Today, ${time}`
  const day = d.toLocaleDateString('en-RW', { day: 'numeric', month: 'short' })
  return `${day}, ${time}`
}

export function summarizeItemNames(names: string[]): string {
  if (names.length <= 3) return names.join(', ')
  return `${names.slice(0, 3).join(', ')} and ${names.length - 3} more`
}

export function getInitials(name: string | null, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    const initials = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0]
    return initials.toUpperCase()
  }
  return email[0]?.toUpperCase() ?? '?'
}
