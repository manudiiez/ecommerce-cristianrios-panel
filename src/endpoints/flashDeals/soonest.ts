import type { Endpoint } from 'payload'

export const soonestEndpoint: Endpoint = {
  path: '/soonest',
  method: 'get',
  handler: async (req) => {
    const { docs } = await req.payload.find({
      collection: 'flash-deals',
      where: { endsAt: { greater_than: new Date().toISOString() } },
      sort: 'endsAt',
      limit: 1,
      req,
    })

    return Response.json(docs[0] ?? null)
  },
}
