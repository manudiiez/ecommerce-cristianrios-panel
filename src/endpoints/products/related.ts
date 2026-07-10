import type { Endpoint } from 'payload'

import { APIError } from 'payload'

export const relatedEndpoint: Endpoint = {
  path: '/:slug/related',
  method: 'get',
  handler: async (req) => {
    const { slug } = req.routeParams as { slug: string }
    const limitParam = new URL(req.url ?? '', 'http://localhost').searchParams.get('limit')
    const limit = Number(limitParam) > 0 ? Number(limitParam) : 4

    const { docs: matches } = await req.payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      req,
    })
    const product = matches[0]
    if (!product) throw new APIError('Producto no encontrado', 404)

    const categoryId = typeof product.category === 'object' ? product.category?.id : product.category
    const worldId = typeof product.world === 'object' ? product.world?.id : product.world

    const { docs: sameCategory } = await req.payload.find({
      collection: 'products',
      where: {
        and: [{ category: { equals: categoryId } }, { slug: { not_equals: slug } }],
      },
      limit,
      req,
    })

    let combined = sameCategory

    if (combined.length < limit) {
      const excludeIds = [product.id, ...combined.map((doc) => doc.id)]
      const { docs: sameWorld } = await req.payload.find({
        collection: 'products',
        where: {
          and: [{ world: { equals: worldId } }, { id: { not_in: excludeIds } }],
        },
        limit: limit - combined.length,
        req,
      })
      combined = [...combined, ...sameWorld]
    }

    return Response.json({ docs: combined })
  },
}
