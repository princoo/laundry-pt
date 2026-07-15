import { Suspense } from 'react'
import { TrackPageContent } from '@/components/track/TrackPageContent'

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackPageContent />
    </Suspense>
  )
}
