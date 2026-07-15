import type { ServiceType } from '@prisma/client'

export const SERVICE_TYPES: ServiceType[] = ['NORMAL', 'DRY_CLEAN', 'PRESSING']

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  NORMAL: 'Normal',
  DRY_CLEAN: 'Dry-cleaning',
  PRESSING: 'Pressing',
}

export const SERVICE_TYPE_DESCRIPTIONS: Record<ServiceType, string> = {
  NORMAL: 'Items collected before 10:00 a.m., returned same day before 7:00 p.m.',
  DRY_CLEAN: 'Items collected before 10:00 a.m., returned same day before 8:00 p.m.',
  PRESSING: 'Items collected before 10:00 a.m., returned same day — ironing only.',
}
