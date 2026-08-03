export type SortOrder = 'asc' | 'desc'

export const DEFAULT_SORT: SortOrder = 'desc'

// Labels describe the request's creation time, which is what the queue sorts on.
export const SORT_LABELS: Record<SortOrder, string> = {
  desc: 'Newest first',
  asc: 'Oldest first',
}

export const QUEUE_PAGE_SIZE = 10

// The queue polls slowly on its own — live updates arrive over the notification
// stream, and staff can always pull fresh data with the manual refresh button.
export const QUEUE_REFRESH_INTERVAL_MS = 5 * 60 * 1000

// The supervisor queue is not paginated yet — it keeps its original flat cap.
export const SUPERVISOR_QUEUE_LIMIT = 20
