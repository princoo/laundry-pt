interface RawItemFormValues {
  nameEn: string
  nameFr: string
  priceNormal: string
  priceDryClean: string
  pricePressing: string
}

function toNullableInt(value: string): number | null {
  if (value.trim() === '') return null
  const parsed = Number.parseInt(value, 10)
  return parsed === 0 ? null : parsed
}

// sortOrder is never in the payload: create appends it server-side and the
// reorder endpoint owns it thereafter.
export function buildItemPayload(values: RawItemFormValues) {
  return {
    nameEn: values.nameEn,
    nameFr: values.nameFr,
    priceNormal: toNullableInt(values.priceNormal),
    priceDryClean: toNullableInt(values.priceDryClean),
    pricePressing: toNullableInt(values.pricePressing),
  }
}
