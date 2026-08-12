'use client'

import { useFormContext } from 'react-hook-form'
import type { ItemFormValues } from '@/lib/validations/item.schema'
import { FieldError } from '@/components/ui/FieldError'
import { INPUT_CLASSES } from '@/lib/constants/formStyles'

const PRICE_FIELDS = [
  { name: 'priceNormal', label: 'Price — Normal (RWF)' },
  { name: 'priceDryClean', label: 'Price — Dry-cleaning (RWF)' },
  { name: 'pricePressing', label: 'Price — Pressing (RWF)' },
] as const

export function ItemFormFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ItemFormValues>()

  return (
    <>
      <div>
        <label className="block text-sm text-salt-text mb-1">Name (English)*</label>
        <input className={INPUT_CLASSES} {...register('nameEn')} />
        <FieldError message={errors.nameEn?.message} />
      </div>
      <div>
        <label className="block text-sm text-salt-text mb-1">Name (French)*</label>
        <input className={INPUT_CLASSES} {...register('nameFr')} />
        <FieldError message={errors.nameFr?.message} />
      </div>

      {PRICE_FIELDS.map(({ name, label }) => (
        <div key={name}>
          <label className="block text-sm text-salt-text mb-1">{label}</label>
          <input
            type="number"
            placeholder="Leave empty if not offered"
            className={INPUT_CLASSES}
            {...register(name)}
          />
        </div>
      ))}

      <div>
        <label className="block text-sm text-salt-text mb-1">Sort order</label>
        <input type="number" className={INPUT_CLASSES} {...register('sortOrder')} />
      </div>
    </>
  )
}
