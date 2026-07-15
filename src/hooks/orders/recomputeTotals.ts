import type { CollectionBeforeChangeHook } from 'payload'

import { APIError } from 'payload'

import { computeProductPrice, normalizeDiscount } from '../../lib/pricing'

interface OrderItem {
  type: 'product' | 'kit' | 'flash'
  refId: string
  name: string
  sizeLabel?: string | null
  finishLabel?: string | null
  variantLabel?: string | null
  unitPrice: number
  qty: number
  sizeSlug?: string | null
  finishSlug?: string | null
}

export const recomputeTotals: CollectionBeforeChangeHook = async ({ data, req }) => {
  const items = (data.items ?? []) as OrderItem[]

  let count = 0
  let total = 0

  for (const item of items) {
    if (item.type === 'product') {
      if (!item.sizeSlug || !item.finishSlug) {
        throw new APIError(
          `Falta el tamaño o el acabado para el ítem '${item.name}'.`,
          400,
        )
      }

      const [{ docs: sizes }, { docs: products }, { docs: finishes }] = await Promise.all([
        req.payload.find({
          collection: 'sizes',
          where: { slug: { equals: item.sizeSlug } },
          limit: 1,
          req,
        }),
        req.payload.find({
          collection: 'products',
          where: { slug: { equals: item.refId } },
          limit: 1,
          req,
        }),
        req.payload.find({
          collection: 'finishes',
          where: { slug: { equals: item.finishSlug } },
          limit: 1,
          req,
        }),
      ])

      const size = sizes[0]
      const product = products[0]
      const finish = finishes[0]

      if (!size) throw new APIError(`El tamaño '${item.sizeSlug}' no existe.`, 400)
      if (!product) throw new APIError(`El producto '${item.refId}' no existe.`, 400)
      if (!finish) throw new APIError(`El acabado '${item.finishSlug}' no existe.`, 400)

      const { price } = computeProductPrice({
        size: { price: size.price, paintedAdd: size.paintedAdd },
        finishSlug: finish.slug,
        sizeSlug: size.slug,
        discount: normalizeDiscount(product.discount),
      })

      item.unitPrice = price
      item.name = item.name || product.name
      item.sizeLabel = size.label
      item.finishLabel = finish.label
    } else if (item.type === 'kit') {
      const { docs: kits } = await req.payload.find({
        collection: 'kits',
        where: { slug: { equals: item.refId } },
        limit: 1,
        req,
      })
      const kit = kits[0]
      if (!kit) throw new APIError(`El kit '${item.refId}' no existe.`, 400)

      item.unitPrice = kit.price
      item.name = item.name || kit.name
    } else if (item.type === 'flash') {
      const { docs: deals } = await req.payload.find({
        collection: 'flash-deals',
        where: { slug: { equals: item.refId } },
        limit: 1,
        req,
      })
      const deal = deals[0]
      if (!deal) throw new APIError(`La oferta '${item.refId}' no existe.`, 400)

      item.unitPrice = deal.price
      item.name = item.name || deal.name
    } else {
      throw new APIError(`Tipo de ítem desconocido: '${item.type}'.`, 400)
    }

    count += item.qty
    total += item.unitPrice * item.qty
  }

  data.items = items
  data.count = count
  data.total = total

  return data
}
