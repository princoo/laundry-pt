'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { itemFormSchema, type ItemFormValues } from '@/lib/validations/item.schema'
import { buildItemPayload } from '@/lib/utils/item'
import { Modal } from '@/components/ui/Modal'
import { ItemFormFields } from '@/components/admin/ItemFormFields'
import type { AdminItem } from '@/lib/hooks/useAdminItems'

interface Props {
  item: AdminItem | null
  onClose: () => void
  onSaved: () => void
}

export function ItemFormModal({ item, onClose, onSaved }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      nameEn: item?.nameEn ?? '',
      nameFr: item?.nameFr ?? '',
      priceNormal: item?.priceNormal?.toString() ?? '',
      priceDryClean: item?.priceDryClean?.toString() ?? '',
      pricePressing: item?.pricePressing?.toString() ?? '',
      sortOrder: item ? String(item.sortOrder) : '0',
    },
  })

  async function onSubmit(values: ItemFormValues) {
    setSubmitError(null)
    const payload = buildItemPayload(values)
    const url = item ? `/api/admin/items/${item.id}` : '/api/admin/items'
    const res = await fetch(url, {
      method: item ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setSubmitError(data?.error ?? 'Could not save item. Try again.')
      return
    }
    onSaved()
  }

  return (
    <Modal title={item ? 'Edit item' : 'Add item'} onClose={onClose}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
          {submitError && (
            <div className="bg-red-50 border border-[0.5px] border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
              {submitError}
            </div>
          )}
          <ItemFormFields />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-[0.5px] border-salt-border rounded-lg px-4 py-2 text-sm text-salt-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-salt-navy hover:bg-salt-navy-hover transition-colors text-white rounded-lg px-4 py-2 text-sm disabled:opacity-60"
            >
              {form.formState.isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}
