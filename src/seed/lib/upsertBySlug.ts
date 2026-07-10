import type { CollectionSlug, Payload } from 'payload'

export async function upsertByField<T extends Record<string, unknown>>(
  payload: Payload,
  collection: CollectionSlug,
  field: string,
  value: string,
  data: T,
): Promise<{ id: string | number }> {
  const { docs } = await payload.find({
    collection,
    where: { [field]: { equals: value } },
    limit: 1,
    depth: 0,
  })

  const existing = docs[0]

  if (existing) {
    return payload.update({
      collection,
      id: existing.id,
      data: { ...data, [field]: value },
    })
  }

  return payload.create({
    collection,
    data: { ...data, [field]: value },
  })
}

export async function upsertBySlug<T extends Record<string, unknown>>(
  payload: Payload,
  collection: CollectionSlug,
  slug: string,
  data: T,
): Promise<{ id: string | number }> {
  return upsertByField(payload, collection, 'slug', slug, data)
}
