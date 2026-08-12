import { StatusStepper } from "@/components/ui/StatusStepper";
import { RequestActions } from "@/components/staff/RequestActions";
import { PermissionGate } from "@/components/ui/PermissionGate";
import type { RequestDetail } from "@/lib/types/request";
import type { RequestStatus } from "@prisma/client";

interface Props {
  request: RequestDetail;
  isUpdating: boolean;
  onAdvance: (status: RequestStatus) => void;
  onCancel: () => void;
}

// The whole card is the moving-a-request surface, so it gates as one. The bare
// StatusStepper stays ungated- the guest tracking page renders it too.
export function RequestStatusCard({
  request,
  isUpdating,
  onAdvance,
  onCancel,
}: Props) {
  return (
    <PermissionGate permission="LAUNDRY_REQUEST_PROCESS">
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-4 sm:p-6">
        <div className="text-[11px] uppercase text-salt-text-muted mb-4">
          Status
        </div>
        <StatusStepper
          status={request.status}
          collectedAt={request.collectedAt}
          completedAt={request.completedAt}
          returnedAt={request.returnedAt}
        />
        <RequestActions
          status={request.status}
          isUpdating={isUpdating}
          onAdvance={onAdvance}
          onCancel={onCancel}
        />
      </div>
    </PermissionGate>
  );
}
