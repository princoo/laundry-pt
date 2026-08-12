import type { RequestStatus, ServiceType } from "@prisma/client";
import type { RequestChange } from "@/lib/utils/requestHistory";

export interface RequestDetailItem {
  id: string;
  serviceType: ServiceType;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  laundryItem: { nameEn: string; nameFr: string };
}

export interface RequestNote {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string | null; roleNames: string[] } | null;
}

export interface AlertEventRecord {
  level: "pickup_overdue" | "return_overdue" | "at_risk" | "deadline_missed";
  detectedAt: string;
}

export interface RequestDetail {
  id: string;
  roomNumber: string;
  guestName: string | null;
  isExpress: boolean;
  isHanger: boolean;
  note: string | null;
  status: RequestStatus;
  grossAmount: number;
  vatAmount: number;
  totalAmount: number;
  createdAt: string;
  collectedAt: string | null;
  completedAt: string | null;
  returnedAt: string | null;
  assignedTo: { id: string; name: string | null } | null;
  assignedAt: string | null;
  items: RequestDetailItem[];
  notes: RequestNote[];
  canManage?: boolean;
  alertEvents?: AlertEventRecord[];
  // The guest is told their request needs changes, so this is always present.
  // Optional to tolerate a payload cached from before the field existed.
  needsChanges?: boolean;
  // Staff only- the public track endpoints omit these deliberately, see
  // services/trackRequest.service.ts.
  flaggedAt?: string | null;
  flagReason?: string | null;
  flaggedBy?: { id: string; name: string | null } | null;
  // Staff only, gated with notes. Newest change first.
  history?: RequestChange[];
}

export interface TrackedRequest extends RequestDetail {
  reference: string;
}
