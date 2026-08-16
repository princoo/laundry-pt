import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { items } from "./seedData";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Only the catalogue is seeded. Staff accounts are never seeded — every user
  // is provisioned by SOA through app/api/integrations/soa/users, so a seeded
  // stand-in would only be a fake row to reconcile against the real one later.
  //
  // Items have no natural key to upsert on, so a catalogue that already exists
  // is left alone rather than duplicated. Prices come per service from the
  // hotel's sheet; a service the sheet doesn't price stays null, which every
  // reader treats as "not offered". No item gets a dry-clean price — the sheet
  // has no dry-cleaning section — so that service is offered only once an
  // admin prices something for it.
  if ((await prisma.laundryItem.count()) === 0) {
    await prisma.laundryItem.createMany({
      data: items.map((item, index) => ({
        ...item,
        priceDryClean: null,
        isActive: true,
        sortOrder: index + 1,
      })),
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
