import type { CollectionBeforeValidateHook } from 'payload'

import { APIError } from 'payload'

export const validateFlashDealPricing: CollectionBeforeValidateHook = async ({
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
    throw new APIError('El precio de referencia debe ser mayor al precio de oferta.', 400)
  }

  if (
    typeof merged.stockLeft === 'number' &&
    typeof merged.stockTotal === 'number' &&
    merged.stockLeft > merged.stockTotal
  ) {
    throw new APIError('El stock restante no puede ser mayor al stock total.', 400)
  }

  return data
}
