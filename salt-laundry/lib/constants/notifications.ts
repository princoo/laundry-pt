import type { NotificationKind } from '@/lib/types/notification'

export const NOTIFICATION_KIND_LABELS: Record<NotificationKind, string | null> = {
  new: null,
  auto_assigned: 'Auto-assigned to you',
  manual_assigned: 'Assigned to you',
  unassigned: 'Unassigned from you',
}

export const NOTIFICATION_KIND_CLASSES: Record<NotificationKind, string> = {
  new: '',
  auto_assigned: 'text-salt-green',
  manual_assigned: 'text-salt-green',
  unassigned: 'text-salt-text-muted',
}
