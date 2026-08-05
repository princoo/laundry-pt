import { RequestHeaderCard } from '@/components/ui/RequestHeaderCard'
import { ItemBreakdownCard } from '@/components/ui/ItemBreakdownCard'
import { StatusStepper } from '@/components/ui/StatusStepper'
import { EditRequestPrompt } from '@/components/track/EditRequestPrompt'
import type { TrackedRequest } from '@/lib/types/request'

interface Props {
  request: TrackedRequest
}

export function TrackRequestDetail({ request }: Props) {
  return (
    <>
      <RequestHeaderCard request={request} reference={request.reference} />
      <ItemBreakdownCard request={request} />
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-6 mt-4">
        <div className="text-[11px] uppercase text-salt-text-muted mb-4">Status</div>
        <StatusStepper
          status={request.status}
          collectedAt={request.collectedAt}
          completedAt={request.completedAt}
          returnedAt={request.returnedAt}
        />
      </div>

      <EditRequestPrompt request={request} />
    </>
  )
}
