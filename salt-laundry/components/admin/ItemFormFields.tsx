'use client'

import { useFormContext } from 'react-hook-form'
import type { ItemFormValues } from '@/lib/validations/item.schema'
import { FieldError } from '@/components/ui/FieldError'

const inputClasses =
  'w-full border border-[0.5px] border-salt-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-salt-navy bg-white'

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
        <input className={inputClasses} {...register('nameEn')} />
        <FieldError message={errors.nameEn?.message} />
      </div>
      <div>
        <label className="block text-sm text-salt-text mb-1">Name (French)*</label>
        <input className={inputClasses} {...register('nameFr')} />
        <FieldError message={errors.nameFr?.message} />
      </div>

      {PRICE_FIELDS.map(({ name, label }) => (
        <div key={name}>
          <label className="block text-sm text-salt-text mb-1">{label}</label>
          <input
            type="number"
            placeholder="Leave empty if not offered"
            className={inputClasses}
            {...register(name)}
          />
        </div>
      ))}

      <div>
        <label className="block text-sm text-salt-text mb-1">Sort order</label>
        <input type="number" className={inputClasses} {...register('sortOrder')} />
      </div>
    </>
  )
}
