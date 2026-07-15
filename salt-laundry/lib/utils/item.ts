interface RawItemFormValues {
  nameEn: string
  nameFr: string
  priceNormal: string
  priceDryClean: string
  pricePressing: string
  sortOrder: string
}

function toNullableInt(value: string): number | null {
  if (value.trim() === '') return null
  const parsed = Number.parseInt(value, 10)
  return parsed === 0 ? null : parsed
}

export function buildItemPayload(values: RawItemFormValues) {
  return {
    nameEn: values.nameEn,
    nameFr: values.nameFr,
    priceNormal: toNullableInt(values.priceNormal),
    priceDryClean: toNullableInt(values.priceDryClean),
    pricePressing: toNullableInt(values.pricePressing),
    sortOrder: values.sortOrder.trim() === '' ? 0 : Number.parseInt(values.sortOrder, 10),
  }
}
