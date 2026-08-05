import { DEFAULT_SORT, type SortOrder } from '@/lib/constants/queue'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants/pagination'

export interface QueueQuery {
  status?: string
  assignedTo?: string
  page?: number
  limit?: number
  sort?: SortOrder
}

export function buildQueueQuery({
  status = 'ALL', assignedTo, page = 1, limit = DEFAULT_PAGE_SIZE, sort = DEFAULT_SORT,
}: QueueQuery): string {
  const params = new URLSearchParams()
  if (status !== 'ALL') params.set('status', status)
  if (assignedTo) params.set('assignedTo', assignedTo)
  params.set('page', String(page))
  params.set('limit', String(limit))
  params.set('sort', sort)
  return params.toString()
}
