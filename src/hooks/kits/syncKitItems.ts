import type { CollectionBeforeValidateHook } from 'payload'

import { APIError } from 'payload'

import type { Product } from '../../payload-types'

type KitItem = {
  name?: string | null
  qty?: number
  product?: unknown
  size?: unknown
  finish?: unknown
}

const idOf = (value: unknown): string | number | undefined => {
  if (value && typeof value === 'object' && 'id' in value) {
    return (value as { id: string | number }).id
  }
  if (typeof value === 'string' || typeof value === 'number') return value
  return undefined
}

export const syncKitItems: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  if (!data) return data

  const merged = { ...originalDoc, ...data }
  const items = (merged.items ?? []) as KitItem[]
  if (items.length === 0) return data

  const productIds = [...new Set(items.map((item) => idOf(item.product)).filter(Boolean))] as (
    | string
    | number
  )[]

  const productsById = new Map<string, Product>()
  if (productIds.length > 0) {
    const { docs } = await req.payload.find({
      collection: 'products',
      where: { id: { in: productIds } },
      depth: 0,
      limit: productIds.length,
      req,
    })
    for (const product of docs) {
      productsById.set(String(product.id), product)
    }
  }

  const resolvedItems = items.map((item) => {
    const productId = idOf(item.product)

    if (!productId) {
      if (!item.name || !String(item.name).trim()) {
        throw new APIError(
          'Los ítems sin producto necesitan un nombre visible (se usan para ítems que solo se venden por WhatsApp).',
          400,
        )
      }
      return { ...item, size: null, finish: null }
    }

    const product = productsById.get(String(productId))
    if (!product) {
      throw new APIError('Uno de los ítems del kit tiene un producto que no existe.', 400)
    }

    const sizeIds = (product.availableSizes ?? []).map(idOf)
    const finishIds = (product.finishes ?? []).map(idOf)

    const sizeId = idOf(item.size)
    if (sizeId && !sizeIds.some((id) => String(id) === String(sizeId))) {
      throw new APIError(
        `El tamaño elegido no está entre los tamaños disponibles de "${product.name}".`,
        400,
      )
    }

    const finishId = idOf(item.finish)
    if (finishId && !finishIds.some((id) => String(id) === String(finishId))) {
      throw new APIError(
        `El acabado elegido no está entre los acabados disponibles de "${product.name}".`,
        400,
      )
    }

    return { ...item, name: product.name }
  })

  return { ...data, items: resolvedItems }
}
