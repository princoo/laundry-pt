import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPriceForService } from "@/lib/utils/pricing";
import { SERVICE_TYPES } from "@/lib/constants/services";
import type {
  CreateItemInput,
  UpdateItemInput,
} from "@/lib/validations/item.schema";

// Every active item with each service it's actually priced for, so the guest
// form can offer a per-item service dropdown without a round trip per change.
// Availability goes through getPriceForService so the API and the server-side
// re-price agree on what "unpriced" means (null *and* 0).
export async function getActiveItemsWithServices() {
  const items = await prisma.laundryItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return items
    .map((item) => ({
      id: item.id,
      nameEn: item.nameEn,
      nameFr: item.nameFr,
      services: SERVICE_TYPES.flatMap((type) => {
        const price = getPriceForService(item, type);
        return price === null ? [] : [{ type, price }];
      }),
    }))
    .filter((item) => item.services.length > 0);
}

export async function getActiveItemsByIds(ids: string[]) {
  return prisma.laundryItem.findMany({
    where: { id: { in: ids }, isActive: true },
  });
}

// The whole catalogue in one shot — the admin page is a single drag-to-reorder
// list, not paged. sortOrder isn't unique, so id breaks the tie and keeps the
// order total (two items that were dragged to adjacent positions can briefly
// share a value between the drop and the reorder write landing).
export async function getAllItems() {
  const [items, total, activeCount] = await Promise.all([
    prisma.laundryItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
    prisma.laundryItem.count(),
    prisma.laundryItem.count({ where: { isActive: true } }),
  ]);
  return { items, total, activeCount };
}

export async function getItemById(id: string) {
  const item = await prisma.laundryItem.findUnique({ where: { id } });
  if (!item) return null;

  const stats = await prisma.requestItem.aggregate({
    where: { laundryItemId: id },
    _count: { id: true },
    _sum: { quantity: true, subtotal: true },
  });

  return {
    ...item,
    timesOrdered: stats._count.id,
    totalQuantity: stats._sum.quantity ?? 0,
    totalRevenue: stats._sum.subtotal ?? 0,
  };
}

// A new item lands at the end of the list. sortOrder is managed entirely here
// and by reorderItems- never typed by an admin- so it is derived rather than
// taken from the request.
export async function createItem(data: CreateItemInput) {
  const { _max } = await prisma.laundryItem.aggregate({
    _max: { sortOrder: true },
  });
  return prisma.laundryItem.create({
    data: { ...data, sortOrder: (_max.sortOrder ?? 0) + 1 },
  });
}

// Rewrites the whole ordering from a list of ids in their new positions.
//
// One bulk UPDATE rather than N per-row updates in a transaction: at ~30 items
// that transaction is 30 round-trips to the database and blows past Prisma's 5s
// interactive-transaction timeout. A single `UPDATE ... FROM (VALUES …)` is one
// round-trip and atomic on its own- a statement either applies wholly or not
// at all- so a half-applied order can never be read. Parameterised, so the ids
// are never interpolated into SQL text.
export async function reorderItems(orderedIds: string[]) {
  const rows = orderedIds.map(
    (id, index) => Prisma.sql`(${id}::text, ${index + 1}::int)`,
  );
  await prisma.$executeRaw`
    UPDATE "laundry_items" AS t
    SET "sortOrder" = v.pos
    FROM (VALUES ${Prisma.join(rows)}) AS v(id, pos)
    WHERE t.id = v.id
  `;
}

export async function updateItem(id: string, data: UpdateItemInput) {
  const existing = await prisma.laundryItem.findUnique({ where: { id } });
  if (!existing) return null;
  return prisma.laundryItem.update({ where: { id }, data });
}

export async function softDeleteItem(id: string) {
  const existing = await prisma.laundryItem.findUnique({ where: { id } });
  if (!existing) return null;
  return prisma.laundryItem.update({
    where: { id },
    data: { isActive: false },
  });
}
