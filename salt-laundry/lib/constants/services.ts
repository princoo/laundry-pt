import type { ServiceType } from "@prisma/client";

// Literal tuple, not `ServiceType[]`: Zod schemas build from it, and a value
// import of the Prisma enum would drag the Prisma runtime into client bundles.
// `satisfies` still fails the build if the schema's enum ever drifts.
export const SERVICE_TYPES = [
  "NORMAL",
  "DRY_CLEAN",
  "PRESSING",
] as const satisfies readonly ServiceType[];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  NORMAL: "Normal / Washing",
  DRY_CLEAN: "Dry-cleaning",
  PRESSING: "Pressing",
};

// Shown wherever one request spans more than one service type.
export const MIXED_SERVICE_LABEL = "Mixed";

// What each service actually does to the clothes — not when it comes back.
// Turnaround is the same for every service and lives on the express control.
export const SERVICE_TYPE_DESCRIPTIONS: Record<ServiceType, string> = {
  NORMAL:
    "Cleans clothes using water and detergent, usually in a washing machine.",
  DRY_CLEAN: "Cleans clothes using chemical solvents instead of water.",
  PRESSING:
    "Removes wrinkles and gives garments a neat finish using heat, steam and/or pressure.",
};
