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
  // is left alone rather than duplicated. Each item carries one price from the
  // hotel's form; it is written to all three service columns because the hotel
  // charges the same whichever service is chosen. Prices can still be adjusted
  // per service afterwards in the admin UI.
  if ((await prisma.laundryItem.count()) === 0) {
    for (const [index, { price, ...item }] of items.entries()) {
      await prisma.laundryItem.create({
        data: {
          ...item,
          priceNormal: price,
          priceDryClean: price,
          pricePressing: price,
          isActive: true,
          sortOrder: index + 1,
        },
      });
    }
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
