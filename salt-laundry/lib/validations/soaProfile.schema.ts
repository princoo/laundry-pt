import { z } from "zod";
import { soaUserSchema } from "@/lib/validations/soaUser.schema";

// Same tolerance as the provisioning payload: a name may arrive bare or
// wrapped in an object, and either must parse.
const namedRef = z.union([
  z.string().trim().min(1),
  z.object({ name: z.string().trim().min(1) }).transform((ref) => ref.name),
]);

// A role carries the permissions that decide what the session may do. A role
// sent as a bare name carries none- it cannot grant anything, and failing
// closed there is the safe reading.
const roleRef = z.union([
  z
    .string()
    .trim()
    .min(1)
    .transform((name) => ({ name, permissions: [] as string[] })),
  z.object({
    name: z.string().trim().min(1),
    permissions: z.array(namedRef).optional().default([]),
  }),
]);

// /me answers with the provisioning shape plus permissions inside each role.
// `status` is optional because SOA only signs in active people; absent is
// read as active, present is honoured.
export const soaProfileSchema = soaUserSchema
  .omit({ roles: true, status: true })
  .extend({
    status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),
    roles: z.array(roleRef).optional().default([]),
  });

export type SoaProfile = z.infer<typeof soaProfileSchema>;
