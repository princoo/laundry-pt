import type { NotificationKind } from '@/lib/types/notification'

export const NOTIFICATION_KIND_LABELS: Record<NotificationKind, string | null> = {
  new: null,
  assigned: 'Assigned to you',
  unassigned: 'Unassigned from you',
}

export const NOTIFICATION_KIND_CLASSES: Record<NotificationKind, string> = {
  new: '',
  assigned: 'text-salt-green',
  unassigned: 'text-salt-text-muted',
}
