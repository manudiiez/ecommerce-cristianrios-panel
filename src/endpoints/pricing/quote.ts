import type { Endpoint } from 'payload'

import { APIError } from 'payload'

import { computeProductPrice, normalizeDiscount } from '../../lib/pricing'

export const quoteEndpoint: Endpoint = {
  path: '/pricing/quote',
  method: 'post',
  handler: async (req) => {
    const body = (await req.json?.()) ?? {}
    const { productSlug, sizeSlug, finishSlug } = body as {
      productSlug?: string
      sizeSlug?: string
      finishSlug?: string
    }

    if (!productSlug || !sizeSlug || !finishSlug) {
      throw new APIError('Faltan datos: productSlug, sizeSlug y finishSlug son requeridos.', 400)
    }

    const [{ docs: products }, { docs: sizes }, { docs: finishes }] = await Promise.all([
      req.payload.find({ collection: 'products', where: { slug: { equals: productSlug } }, limit: 1, req }),
      req.payload.find({ collection: 'sizes', where: { slug: { equals: sizeSlug } }, limit: 1, req }),
      req.payload.find({ collection: 'finishes', where: { slug: { equals: finishSlug } }, limit: 1, req }),
    ])

    const product = products[0]
    const size = sizes[0]
    const finish = finishes[0]

    if (!product) throw new APIError('Producto no encontrado', 404)
    if (!size) throw new APIError('Tamaño no encontrado', 404)
    if (!finish) throw new APIError('Acabado no encontrado', 404)

    const result = computeProductPrice({
      size: { price: size.price, paintedAdd: size.paintedAdd },
      finishSlug: finish.slug,
      discount: normalizeDiscount(product.discount),
    })

    return Response.json(result)
  },
}
