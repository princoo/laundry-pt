import { prisma } from "@/lib/prisma";
import { ACTIVE_STATUSES } from "@/lib/constants/statuses";

export class NotAHousekeeperError extends Error {}

// Both flags on this screen behave the same way when switched off: the person
// leaves the assignment picker, and work already on their plate stays with
// them until a supervisor moves it. That open count is what the caller warns
// about, so it is counted once here.
async function countOpenTasks(userId: string) {
  return prisma.request.count({
    where: { assignedToId: userId, status: { in: ACTIVE_STATUSES } },
  });
}

// Toggles a housekeeper's shift availability. Going off shift only marks them
// in the supervisor's assignment picker- work already on their plate stays
// with them until a supervisor reassigns it.
export async function setHousekeeperAvailability(
  userId: string,
  isAvailable: boolean,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isHousekeeper: true, name: true },
  });
  if (!user) return null;
  // Not access control- an account that is not a housekeeper simply has no
  // shift to be on.
  if (!user.isHousekeeper) throw new NotAHousekeeperError();

  await prisma.user.update({ where: { id: userId }, data: { isAvailable } });

  const openTasks = isAvailable ? 0 : await countOpenTasks(userId);
  return { isAvailable, name: user.name, openTasks };
}

// Who counts as a housekeeper is the laundry's own decision- SOA has no such
// flag and no permission for it, so it is gated with shift management and set
// on the same screen.
export async function setHousekeeperFlag(
  userId: string,
  isHousekeeper: boolean,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  if (!user) return null;

  await prisma.user.update({ where: { id: userId }, data: { isHousekeeper } });

  const openTasks = isHousekeeper ? 0 : await countOpenTasks(userId);
  return { isHousekeeper, name: user.name, openTasks };
}
