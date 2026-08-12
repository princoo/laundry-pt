import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { items, users } from "./seedData";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Items have no natural key to upsert on, and prices are edited in the app
  // after seeding- so a catalogue that already exists is left alone rather
  // than duplicated or overwritten.
  if ((await prisma.laundryItem.count()) === 0) {
    for (const [index, item] of items.entries()) {
      await prisma.laundryItem.create({
        data: { ...item, isActive: true, sortOrder: index + 1 },
      });
    }
  }

  // Upserted on soaId so reseeding is not a duplicate-key crash.
  for (const user of users) {
    const name = `${user.firstName} ${user.secondName}`;
    await prisma.user.upsert({
      where: { soaId: user.soaId },
      create: { ...user, name },
      update: { ...user, name },
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
