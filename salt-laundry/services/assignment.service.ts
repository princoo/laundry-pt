import { prisma } from "@/lib/prisma";

// A request is created unassigned and stays that way until a supervisor puts it
// in someone's hands here. This is the only way a request gains an assignee, and
// the only way one moves between housekeepers- nothing assigns work on its own.
// When the task is taken off someone, they're stamped as the previous holder so
// the notification stream can tell them it's no longer theirs.
export async function assignRequest(
  requestId: string,
  housekeeperId: string,
): Promise<void> {
  const current = await prisma.request.findUnique({
    where: { id: requestId },
    select: { assignedToId: true },
  });
  if (!current) throw new Error("Request not found");

  const previousAssigneeId = current.assignedToId;
  const wasTakenFromSomeoneElse =
    previousAssigneeId && previousAssigneeId !== housekeeperId;

  await prisma.request.update({
    where: { id: requestId },
    data: {
      assignedToId: housekeeperId,
      assignedAt: new Date(),
      ...(wasTakenFromSomeoneElse && {
        unassignedFromId: previousAssigneeId,
        unassignedAt: new Date(),
      }),
    },
  });
}
