import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { FetchError } from '@/components/ui/FetchError'
import { TrackNotFound } from '@/components/track/TrackNotFound'

interface Props {
  isLoading: boolean
  error: string | null
  onRetry: () => void
  notFound?: boolean
  notFoundMessage?: string
}

export function SearchStatus({ isLoading, error, onRetry, notFound, notFoundMessage }: Props) {
  if (isLoading) return <LoadingSkeleton rows={2} height="h-24" rounded="rounded-xl" />
  if (error) return <FetchError message={error} onRetry={onRetry} />
  if (notFound) return <TrackNotFound message={notFoundMessage} />
  return null
}
