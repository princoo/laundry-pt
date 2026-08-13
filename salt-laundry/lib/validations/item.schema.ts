import { z } from 'zod'

// sortOrder is absent on purpose: an item's position is owned by createItem
// (append) and the reorder endpoint, never set through this form or the edit
// PATCH.
export const createItemSchema = z.object({
  nameEn: z.string().trim().min(1, 'English name is required'),
  nameFr: z.string().trim().min(1, 'French name is required'),
  priceNormal: z.number().int().nullable().optional(),
  priceDryClean: z.number().int().nullable().optional(),
  pricePressing: z.number().int().nullable().optional(),
})

export type CreateItemInput = z.infer<typeof createItemSchema>

export const updateItemSchema = z.object({
  nameEn: z.string().trim().min(1, 'English name is required').optional(),
  nameFr: z.string().trim().min(1, 'French name is required').optional(),
  priceNormal: z.number().int().nullable().optional(),
  priceDryClean: z.number().int().nullable().optional(),
  pricePressing: z.number().int().nullable().optional(),
  isActive: z.boolean().optional(),
})

export type UpdateItemInput = z.infer<typeof updateItemSchema>

export const itemFormSchema = z.object({
  nameEn: z.string().trim().min(1, 'English name is required'),
  nameFr: z.string().trim().min(1, 'French name is required'),
  priceNormal: z.string(),
  priceDryClean: z.string(),
  pricePressing: z.string(),
})

export type ItemFormValues = z.infer<typeof itemFormSchema>

export const reorderItemsSchema = z.object({
  orderedIds: z.array(z.string()).min(1, 'No items to reorder'),
})

export type ReorderItemsInput = z.infer<typeof reorderItemsSchema>
