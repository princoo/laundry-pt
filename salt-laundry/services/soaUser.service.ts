import { prisma } from "@/lib/prisma";
import { fullName } from "@/lib/utils/user";
import type { SoaUserInput } from "@/lib/validations/soaUser.schema";

export class EmailBelongsToAnotherUserError extends Error {}

const PROVISIONED_SELECT = {
  id: true,
  soaId: true,
  staffId: true,
  name: true,
  email: true,
  phoneNumber: true,
  departmentName: true,
  roleNames: true,
  isHousekeeper: true,
  isActive: true,
  isAvailable: true,
} as const;

function toRow(payload: SoaUserInput) {
  return {
    staffId: payload.staffId ?? null,
    firstName: payload.firstName ?? null,
    secondName: payload.secondName ?? null,
    name: fullName(payload.firstName, payload.secondName),
    email: payload.email.toLowerCase(),
    phoneNumber: payload.phoneNumber ?? null,
    departmentName: payload.department ?? null,
    roleNames: payload.roles ?? [],
    isActive: payload.status === "ACTIVE",
  };
}

// Upserts on soaId, so SOA can retry a create safely- the same payload twice
// is one row, not two. Deactivation arrives as status INACTIVE; a user is
// never deleted, because requests and notes still point at them.
export async function upsertFromSoa(payload: SoaUserInput) {
  const row = toRow(payload);

  const emailOwner = await prisma.user.findUnique({
    where: { email: row.email },
    select: { soaId: true },
  });
  if (emailOwner && emailOwner.soaId !== payload.id) {
    throw new EmailBelongsToAnotherUserError();
  }

  const existing = await prisma.user.findUnique({
    where: { soaId: payload.id },
    select: { id: true },
  });

  const user = await prisma.user.upsert({
    where: { soaId: payload.id },
    create: { soaId: payload.id, ...row },
    update: row,
    select: PROVISIONED_SELECT,
  });

  return { user, created: !existing };
}
