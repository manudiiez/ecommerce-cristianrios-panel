import type { CollectionAfterReadHook } from 'payload'

export const epochEndsAt: CollectionAfterReadHook = async ({ doc }) => {
  if (doc.endsAt) {
    doc.endsAt = new Date(doc.endsAt).getTime()
  }
  return doc
}
