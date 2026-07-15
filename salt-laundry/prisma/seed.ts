import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const items = [
  { nameEn: "Shirt", nameFr: "Chemise" },
  { nameEn: "Blouse", nameFr: "Chemisier" },
  { nameEn: "Trousers", nameFr: "Pantalon" },
  { nameEn: "Skirt", nameFr: "Jupe" },
  { nameEn: "Dress", nameFr: "Robe" },
  { nameEn: "Shorts", nameFr: "Short" },
  { nameEn: "Polo shirt", nameFr: "Polo" },
  { nameEn: "T-Shirt", nameFr: "T-Shirt" },
  { nameEn: "Tank top", nameFr: "Débardeur" },
  { nameEn: "Socks", nameFr: "Chaussettes" },
  { nameEn: "Slip", nameFr: "Caleçon" },
  { nameEn: "Panties", nameFr: "Culotte" },
  { nameEn: "Bra", nameFr: "Soutien-gorge" },
  { nameEn: "Pyjamas", nameFr: "Pyjama" },
  { nameEn: "Night dress", nameFr: "Chemise de nuit" },
  { nameEn: "Swim shorts", nameFr: "Maillot de bain" },
  { nameEn: "Suit", nameFr: "Complet" },
  { nameEn: "Jacket", nameFr: "Veste" },
  { nameEn: "Tie", nameFr: "Cravatte" },
  { nameEn: "Silk shirt", nameFr: "Chemise en soie" },
  { nameEn: "Silk blouse", nameFr: "Chemisier en soie" },
  { nameEn: "Silk dress", nameFr: "Robe en soie" },
  { nameEn: "Lady's suit", nameFr: "Tailleur" },
];

async function main() {
  for (const [index, item] of items.entries()) {
    await prisma.laundryItem.create({
      data: {
        nameEn: item.nameEn,
        nameFr: item.nameFr,
        priceNormal: null,
        priceDryClean: null,
        pricePressing: null,
        isActive: true,
        sortOrder: index + 1,
      },
    });
  }

  const hashedPassword = await bcrypt.hash("Admin1234!", 12);
  await prisma.user.create({
    data: {
      email: "admin@salt.rw",
      name: "SALT Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
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
