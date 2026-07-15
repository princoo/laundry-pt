import { z } from 'zod'

export const createItemSchema = z.object({
  nameEn: z.string().trim().min(1, 'English name is required'),
  nameFr: z.string().trim().min(1, 'French name is required'),
  priceNormal: z.number().int().nullable().optional(),
  priceDryClean: z.number().int().nullable().optional(),
  pricePressing: z.number().int().nullable().optional(),
  sortOrder: z.number().int().optional(),
})

export type CreateItemInput = z.infer<typeof createItemSchema>

export const updateItemSchema = z.object({
  nameEn: z.string().trim().min(1, 'English name is required').optional(),
  nameFr: z.string().trim().min(1, 'French name is required').optional(),
  priceNormal: z.number().int().nullable().optional(),
  priceDryClean: z.number().int().nullable().optional(),
  pricePressing: z.number().int().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export type UpdateItemInput = z.infer<typeof updateItemSchema>

export const itemFormSchema = z.object({
  nameEn: z.string().trim().min(1, 'English name is required'),
  nameFr: z.string().trim().min(1, 'French name is required'),
  priceNormal: z.string(),
  priceDryClean: z.string(),
  pricePressing: z.string(),
  sortOrder: z.string(),
})

export type ItemFormValues = z.infer<typeof itemFormSchema>
