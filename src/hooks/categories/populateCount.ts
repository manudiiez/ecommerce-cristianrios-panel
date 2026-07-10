import type { CollectionAfterReadHook } from 'payload'

export const populateCount: CollectionAfterReadHook = async ({ doc, req }) => {
  const { totalDocs } = await req.payload.count({
    collection: 'products',
    where: { category: { equals: doc.id } },
    req,
  })

  doc.count = totalDocs
  return doc
}
