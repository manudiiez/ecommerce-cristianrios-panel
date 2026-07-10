import type { CollectionBeforeValidateHook } from 'payload'

import { APIError } from 'payload'

export const validateCategoryMode: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data

  const merged = { ...originalDoc, ...data }
  const categoryId = typeof merged.category === 'object' ? merged.category?.id : merged.category

  if (categoryId) {
    const category = await req.payload.findByID({
      collection: 'categories',
      id: categoryId,
      depth: 0,
      req,
    })

    if (category && category.mode !== 'whatsapp') {
      throw new APIError('La categoría elegida no es de tipo WhatsApp.', 400)
    }
  }

  return data
}
