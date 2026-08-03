export type SortOrder = 'asc' | 'desc'

export const DEFAULT_SORT: SortOrder = 'desc'

// Labels describe the request's creation time, which is what the queue sorts on.
export const SORT_LABELS: Record<SortOrder, string> = {
  desc: 'Newest first',
  asc: 'Oldest first',
}

export const QUEUE_PAGE_SIZE = 10

// The supervisor queue is not paginated yet — it keeps its original flat cap.
export const SUPERVISOR_QUEUE_LIMIT = 20
