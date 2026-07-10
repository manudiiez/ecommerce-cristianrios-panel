import type { CollectionBeforeValidateHook } from 'payload'

import { APIError } from 'payload'

export const validateKitPricing: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
}) => {
  if (!data) return data

  const merged = { ...originalDoc, ...data }

  if (
    typeof merged.regular === 'number' &&
    typeof merged.price === 'number' &&
    !(merged.regular > merged.price)
  ) {
    throw new APIError('El precio de referencia debe ser mayor al precio final del kit.', 400)
  }

  return data
}
