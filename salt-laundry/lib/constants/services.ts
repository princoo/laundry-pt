import type { ServiceType } from '@prisma/client'

// Literal tuple, not `ServiceType[]`: Zod schemas build from it, and a value
// import of the Prisma enum would drag the Prisma runtime into client bundles.
// `satisfies` still fails the build if the schema's enum ever drifts.
export const SERVICE_TYPES = ['NORMAL', 'DRY_CLEAN', 'PRESSING'] as const satisfies readonly ServiceType[]

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
