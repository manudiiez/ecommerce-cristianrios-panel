import type { CollectionBeforeValidateHook } from 'payload'

import { APIError } from 'payload'

export const validateProductRelations: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const merged = { ...originalDoc, ...data }
  if (!data) return data

  const categoryId =
    typeof merged.category === 'object' ? merged.category?.id : merged.category
  const worldId = typeof merged.world === 'object' ? merged.world?.id : merged.world

  if (categoryId && worldId) {
    const category = await req.payload.findByID({
      collection: 'categories',
      id: categoryId,
      depth: 0,
      req,
    })

    if (category) {
      const categoryWorldId =
        typeof category.world === 'object' ? category.world?.id : category.world

      if (String(categoryWorldId) !== String(worldId)) {
        throw new APIError(
          'El mundo del producto debe coincidir con el mundo de su categoría.',
          400,
        )
      }

      if (category.mode !== 'catalog') {
        throw new APIError(
          "La categoría elegida es de tipo WhatsApp. Los productos de catálogo necesitan una categoría de tipo 'Catálogo'.",
          400,
        )
      }
    }
  }

  const availableSizes = (merged.availableSizes ?? []) as Array<string | { id: string }>
  if (availableSizes.length > 0 && worldId) {
    const sizeIds = availableSizes.map((s) => (typeof s === 'object' ? s.id : s))
    const { docs: sizes } = await req.payload.find({
      collection: 'sizes',
      where: { id: { in: sizeIds } },
      depth: 0,
      limit: sizeIds.length,
      req,
    })

    const mismatched = sizes.some((size) => {
      const sizeWorldId = typeof size.world === 'object' ? size.world?.id : size.world
      return String(sizeWorldId) !== String(worldId)
    })

    if (mismatched) {
      throw new APIError(
        'Todos los tamaños seleccionados deben pertenecer al mismo mundo del producto.',
        400,
      )
    }
  }

  if (merged.discount?.scope === 'finish' && !merged.discount?.finish) {
    throw new APIError(
      "Elegiste 'Solo un acabado' para el descuento: seleccioná a qué acabado aplica.",
      400,
    )
  }

  if (merged.discount?.sizeScope === 'specific' && !(merged.discount?.sizes?.length > 0)) {
    throw new APIError(
      "Elegiste 'Tamaños específicos' para el descuento: seleccioná al menos un tamaño.",
      400,
    )
  }

  return data
}
