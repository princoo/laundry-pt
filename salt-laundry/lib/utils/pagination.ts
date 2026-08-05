import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/lib/constants/pagination'

export interface PageParams {
  page: number
  limit: number
}

// Reads ?page and ?limit off a request URL, clamped so a bad or hostile value
// can never produce a negative skip or an unbounded take.
export function parsePageParams(searchParams: URLSearchParams): PageParams {
  const page = Math.max(1, Math.floor(Number(searchParams.get('page'))) || 1)
  const requested = Math.floor(Number(searchParams.get('limit'))) || DEFAULT_PAGE_SIZE
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, requested))
  return { page, limit }
}

// Prisma's skip/take for a page.
export function pageSlice({ page, limit }: PageParams) {
  return { skip: (page - 1) * limit, take: limit }
}

// The pagination envelope every listing endpoint returns alongside its rows.
// An empty result is page 1 of 1, not page 1 of 0 — the pager reads better.
export function buildPageMeta(total: number, { page, limit }: PageParams) {
  return { total, page, totalPages: Math.max(1, Math.ceil(total / limit)) }
}

export type PageToken = number | 'gap'

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i)

// Which page numbers the pager should render, with 'gap' standing in for a
// collapsed run. The first and last page are always reachable in one click,
// plus `siblings` either side of the current one — so the control keeps a
// fixed width however deep into the list you are.
export function getPageRange(page: number, totalPages: number, siblings = 1): PageToken[] {
  const maxSlots = siblings * 2 + 5 // first, last, current, both siblings, two gaps
  if (totalPages <= maxSlots) return range(1, totalPages)

  const left = Math.max(page - siblings, 1)
  const right = Math.min(page + siblings, totalPages)
  // A gap earns its slot only when it hides two or more pages. Collapsing a
  // single page costs the same width and takes that page out of reach.
  const hasLeftGap = left > 3
  const hasRightGap = right < totalPages - 2

  if (!hasLeftGap) return [...range(1, maxSlots - 2), 'gap', totalPages]
  if (!hasRightGap) return [1, 'gap', ...range(totalPages - maxSlots + 3, totalPages)]
  return [1, 'gap', ...range(left, right), 'gap', totalPages]
}
