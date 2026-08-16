// The hotel's price sheet: one bilingual list with two priced sections,
// washing and pressing. An item missing from a section has no price for that
// service, stored as null — the API, the request form and the server-side
// re-price all read null (and 0) as "not offered". Dry-cleaning has no section
// on the sheet at all, so the seed prices no item for it; giving an item a
// dry-clean price in the admin UI is all it takes to start offering it.
//
// Order follows the sheet's washing section; "Polo shirt" only exists in the
// pressing section, where it sits next to "T-Shirt", so it keeps that spot.
export interface SeedItem {
  nameEn: string;
  nameFr: string;
  priceNormal: number | null;
  pricePressing: number | null;
}

export const items: SeedItem[] = [
  { nameEn: "Shirt", nameFr: "Chemise", priceNormal: 5000, pricePressing: 2000 },
  { nameEn: "Blouse", nameFr: "Chemisier", priceNormal: 5000, pricePressing: 2000 },
  { nameEn: "Trousers", nameFr: "Pantalon", priceNormal: 5000, pricePressing: 2000 },
  { nameEn: "Skirt", nameFr: "Jupe", priceNormal: 5000, pricePressing: 2000 },
  { nameEn: "Dress", nameFr: "Robe", priceNormal: 5000, pricePressing: 2000 },
  { nameEn: "Shorts", nameFr: "Short", priceNormal: 5000, pricePressing: null },
  { nameEn: "Suit", nameFr: "Complet", priceNormal: 15000, pricePressing: 10000 },
  { nameEn: "Jacket", nameFr: "Veste", priceNormal: 8000, pricePressing: 4000 },
  { nameEn: "Tie", nameFr: "Cravate", priceNormal: 4000, pricePressing: 2000 },
  { nameEn: "Silk shirt", nameFr: "Chemise en soie", priceNormal: 5000, pricePressing: null },
  { nameEn: "Silk blouse", nameFr: "Chemisier en soie", priceNormal: 5000, pricePressing: null },
  { nameEn: "Silk dress", nameFr: "Robe en soie", priceNormal: 5000, pricePressing: null },
  { nameEn: "Lady's suit", nameFr: "Tailleur", priceNormal: 15000, pricePressing: 10000 },
  { nameEn: "Polo shirt", nameFr: "Polo", priceNormal: null, pricePressing: 2000 },
  { nameEn: "T-Shirt", nameFr: "T-Shirt", priceNormal: 5000, pricePressing: 2000 },
  { nameEn: "Tank top", nameFr: "Débardeur", priceNormal: 4000, pricePressing: 2000 },
  { nameEn: "Socks", nameFr: "Chaussettes", priceNormal: 3000, pricePressing: 1000 },
  { nameEn: "Slip", nameFr: "Caleçon", priceNormal: 2000, pricePressing: null },
  { nameEn: "Panties", nameFr: "Culotte", priceNormal: 2000, pricePressing: 1000 },
  { nameEn: "Bra", nameFr: "Soutien-gorge", priceNormal: 2000, pricePressing: 1000 },
  { nameEn: "Pyjamas", nameFr: "Pyjama", priceNormal: 5000, pricePressing: 2000 },
  { nameEn: "Night dress", nameFr: "Chemise de nuit", priceNormal: 5000, pricePressing: 2000 },
  { nameEn: "Swim shorts", nameFr: "Maillot de bain", priceNormal: 4000, pricePressing: 2000 },
  { nameEn: "Shoes", nameFr: "Chaussures", priceNormal: 10000, pricePressing: null },
];
