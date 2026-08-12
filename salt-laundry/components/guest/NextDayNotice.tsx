"use client";

import type { ServiceType } from "@prisma/client";
import { Moon } from "lucide-react";
import { useNextDayReturn } from "@/lib/hooks/useNextDayReturn";
import { getReturnCutoffLabel } from "@/lib/utils/returnCutoff";

interface Props {
  serviceTypes: ServiceType[];
}

// Shown only once today's return time has passed- the standard service
// description already covers everything the guest needs before that.
export function NextDayNotice({ serviceTypes }: Props) {
  const isNextDay = useNextDayReturn(serviceTypes);
  if (!isNextDay) return null;

  return (
    <div className="mt-3 flex items-start gap-2 rounded-lg bg-salt-cream px-3 py-2.5">
      <Moon className="w-4 h-4 text-salt-text-sec mt-0.5 shrink-0" />
      <p className="text-xs text-salt-text-sec">
        Past today&apos;s {getReturnCutoffLabel(serviceTypes)} return time-
        items submitted now are returned tomorrow.
      </p>
    </div>
  );
}
