import type { LaundryItemOption } from "@/lib/types/guestOrder";

const MAX_RESULTS = 6;

// Accent- and case-insensitive: a guest typing "veste" on a phone keyboard
// shouldn't lose "Veste" to an accent they didn't type.
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

// Both names are searched, so either language finds the item. Names that start
// with the query rank first- typing "sh" should surface "Shirt" over "T-shirt".
// Sort is stable, so within a rank the catalogue's own order survives.
export function searchItems(
  items: readonly LaundryItemOption[],
  query: string,
): LaundryItemOption[] {
  const q = normalize(query);
  if (!q) return [];

  return items
    .flatMap((item) => {
      const names = [normalize(item.nameEn), normalize(item.nameFr)];
      if (names.some((name) => name.startsWith(q))) return [{ item, rank: 0 }];
      if (names.some((name) => name.includes(q))) return [{ item, rank: 1 }];
      return [];
    })
    .sort((a, b) => a.rank - b.rank)
    .slice(0, MAX_RESULTS)
    .map(({ item }) => item);
}
